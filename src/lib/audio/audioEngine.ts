/*
    Main audio engineMachine glue.
 */

import { el } from "@elemaudio/core";
import { Sound, Waves } from "../common/globals";
import { audioStore } from "../stores/audioStores";
import { store } from "../stateMachinery/engineStateService"; // todo: move to simpler store
import { speechStore } from "../stores/audioStores";
import { get } from "svelte/store";
import { Speech } from "./speech";
import { fsmToggle } from "../../lib/stores/fsmStoreNew";
import getCore from "./elemWebRenderer";
import { GraphScrubSynth } from "./tones";
import { asSamplesFile } from "./samplers";
import { FuncGen } from "./control";
import type { FunctionGenerator } from "../../types/audio";
import { echo } from "./effects";


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
  private funcGens: FunctionGenerator [] = new Array()

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
          [Waves.FOUR_EXPO]: await(asSamplesFile(
            {
              url: 'waves/FourExpoFading.wav',
              category: 'wavetable',
              local: true,
              tag: Waves.FOUR_EXPO
            })),
          [Waves.FOUR_REV]: await(asSamplesFile(
            {
              url: 'waves/FourReverseLinFade.wav',
              category: 'wavetable',
              local: true,
              tag: Waves.FOUR_REV
            })),
          [Waves.FAST_BOW]: await(asSamplesFile(
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

      for (const wave in Waves) {
        this.funcGens.push( new FuncGen(wave) )
      }

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
      let sounding: boolean
      const unsub = simpleSwitch.subscribe((s)=> sounding = (s === 'on')  );

      pingFreq = (sounding) ?  800 : 300
      const onOffSignal = el.const( {value: onOff, key: "pingGate" } )

      const envL = this.funcGens[0].envelope({
        onOff: onOffSignal,
        env: Waves.FAST_BOW,
        durMS: 0.01,
        level: 0.2 })

      const envR = this.funcGens[1].envelope({
        onOff: onOffSignal,
        env: Waves.FOUR_REV,
        durMS: 0.005,
        level: 1 })

      let pingL = el.mul (
                        envL,
                        el.cycle(el.const({value: (Date.now() % 24) + 3, key: 'pingLmod'})),
                        el.cycle(el.const({value: pingFreq, key: 'pingL'}))
        )

      let pingR = el.mul (
                          envR,
                          el.cycle(el.const({value: (Date.now() % 12) + 3, key: 'pingRmod'})),
                          el.cycle(el.const({value: pingFreq * 1.618, key: 'pingR'}))
      )
      if (!sounding) {
        pingR = echo(
          { signal: el.mul(0.2, pingR),
          timeConstantMS: 123,
          feedback: 0.4,
          id: 'ping-fx'} )
      }
    this.renderStereo(  pingL, pingR  )
  }

  scrubGraphSonification(dataValue:number, dataSource?:string  )  {

    const engineState = get(store).state;
    const { isActive: voiceActive, latestUtterance } = get(speechStore)

    if ( voiceActive && (latestUtterance !== dataSource) ) this.say(dataSource)
    if (typeof dataValue !== 'number' ) { console.log( 'error in data' ); return }
    if (engineState===(Sound.PAUSED || Sound.UNMOUNTED)) return
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
