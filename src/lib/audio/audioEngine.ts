/*
    Main audio engineMachine glue.
 */

import { el } from "@elemaudio/core";
import { Sound, Waves } from "../common/globals";
import { audioStore } from "../stores/audioStores";
import { machine, send, store } from "../stateMachinery/engineStateService";
import { speechStore } from "../stores/audioStores";
import { get } from "svelte/store";
import { Speech } from "./speech";
import { fsmToggle } from "../../lib/stores/fsmStoreNew";
import getCore from "./elemWebRenderer";
import { GraphScrubSynth } from "./tones";
import { asSamplesFile } from "./samplers";
import { FuncGen } from "./control";
import type { FunctionGenerator } from "../../types/audio";

type AudioContextInfo = {
  context: AudioContext,
  status: AudioContextState,
  sampleRate: number
}

export type Engine = {
  scrubGraphSound: Function
}

let core = getCore();
const simpleSwitch = fsmToggle

const voiceGuide = new Speech()

abstract class AudioEngine {
  private static ctx: AudioContext;
  protected constructor(ctx: AudioContext) {
    AudioEngine.ctx = ctx
  }
  public static getBaseContextInfo(): AudioContextInfo {
    return  { context: AudioEngine.ctx, status: AudioEngine.ctx.state, sampleRate: AudioEngine.ctx.sampleRate } ;
  }
  protected setAudioContextState(state: AudioContextState) {
    if(AudioEngine.ctx) {
      switch (state) {
        case "closed":
          AudioEngine.ctx.close();
          break;
        case "suspended":
          AudioEngine.ctx.suspend();
          break;
        case "running":
          AudioEngine.ctx.resume();
      }
    }
  }
  public static getInstanceOfElementary( baseACTX: AudioContext) { return };
  abstract mount();
  abstract mute();
  protected resume() { this.setAudioContextState('running') };
  abstract ping();
  protected static masterVolume: number;
  abstract setMasterVolume(volume: number);
}
/////////////////////////////////////////////////////////////////////////////////

// todo: bring this instantiation up to Elementary v1.0 allowing for offline renderer option
class Elementary extends AudioEngine  {
  private static instance: Elementary;
  masterVolume: number;
  private actx: AudioContext;
  private sr: number
  private funcGen: FunctionGenerator

  private constructor(baseACTX: AudioContext) {
    if (!baseACTX) throw new Error('Base AudioContext does not exist!')
    super(baseACTX);
    this.actx = AudioEngine.getBaseContextInfo().context;
    this.masterVolume = 0.5;
    this.sr = this.actx.sampleRate
  }

  public static getInstanceOfElementary( baseACTX: AudioContext): Elementary {
    if (!Elementary.instance) {
      Elementary.instance = new Elementary(baseACTX);
    }
    return Elementary.instance;
  }

  async mount() {
    if (!this.actx) return false;

    super.setAudioContextState('suspended')
    const elementaryNode = await core.initialize(this.actx, {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [2],
      processorOptions: {
        virtualFileSystem: {
          'FourExpoFading': await(asSamplesFile(
            {
              url: 'waves/FourExpoFading.wav',
              category: 'wavetable',
              local: true,
              tag: Waves.FOUR_EXPO
            })),
          'FourReverseLinFade': await(asSamplesFile(
            {
              url: 'waves/FourReverseLinFade.wav',
              category: 'wavetable',
              local: true,
              tag: Waves.FOUR_REV
            })),
          'FastBowing': await(asSamplesFile(
            {
              url: 'waves/FastBowing.wav',
              category: 'wavetable',
              local: true,
              tag: Waves.FAST_BOW
            }))
        }
      }
    });


    core.on("load", (event) => {
      console.log("🔉 Elementary Audio ready -> " + Object.keys(event));
      audioStore.update(store => ({ ...store, elementaryReady: true}))
      console.log("connecting node graph to destination... max channel count: \t" + this.actx.destination.maxChannelCount);
      elementaryNode.connect(this.actx.destination);
      this.funcGen = new FuncGen( Waves.EXP, false )
    });
  }

  resume() {
    if(this.getMainContextStatus()==='running') return
    super.resume()
    audioStore.update(store => ({ ...store, contextState: 'running'  }))
  }

  getMainContextStatus() {
    return AudioEngine.getBaseContextInfo().status;
  }

  setMasterVolume(volume: number) {
    this.masterVolume = Math.min(volume, Sound.MAX_VOLUME)
  }

  ping( onOff:number = 0.25) {
      this.resume();
      this.setMasterVolume(0.5);
      let pingFreq: number;
      const unsub = simpleSwitch.subscribe((s)=> pingFreq = (s === 'on') ?  800 : 300 );
      const onOffSignal = el.const( {value: onOff, key: "pingGate" } )

      const envL = this.funcGen.envelope({
        onOff: onOffSignal,
        env: Waves.EXP,
        durMS: 1,
        level: 0.7 })

      const envR = this.funcGen.envelope({
        onOff: onOffSignal,
        env: Waves.EXP,
        durMS: 8,
        level: 0.1 })

      const pingL = el.mul (
                        envL,
                        el.cycle(el.const({value: (Date.now() % 24) + 3, key: 'pingLmod'})),
                        el.cycle(el.const({value: pingFreq, key: 'pingL'}))
        )

      const pingR = el.mul (
                          envR,
                          el.cycle(el.const({value: (Date.now() % 12) + 3, key: 'pingRmod'})),
                          el.cycle(el.const({value: pingFreq * 1.618, key: 'pingR'}))
      )
    this.renderStereo(  pingL, pingR  )
  }

  scrubGraphSonification(dataValue:number, dataSource?:string  )  {

    const engineState = get(store).state;
    const { isActive: voiceActive, latestUtterance } = get(speechStore)

    if ( voiceActive && (latestUtterance !== dataSource) ) this.say(dataSource)
    if (typeof dataValue !== 'number' ) { console.log( 'error in data' ); return }
    if (engineState===(Sound.PAUSED || Sound.UNMOUNTED)) return
    this.setMasterVolume(0.8)
    const synth = GraphScrubSynth( {freq: dataValue, gate: 1} )
    this.render(synth)
  }

  mute() {
    this.setMasterVolume(0);
  }

  say( text:string) {
    voiceGuide.speak(text)
  }

  render( sound? ): void  {
    const outM = el.mul( sound, el.sm( el.const( {key: 'zM' , value: this.masterVolume} ) ) )
    core.render(outM, outM)
  }

  renderStereo( left?, right?) {
    const outL = el.mul( left, el.sm( el.const( {key: 'zL' , value: this.masterVolume} ) ) )
    const outR = el.mul( right, el.sm( el.const( {key: 'zR' , value: this.masterVolume} ) ) )
    core.render(outL , outR)
  }

}

export default Elementary;
