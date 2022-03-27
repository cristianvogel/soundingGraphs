/*
    Main audio engineStateMachine glue.
    Move Elementary.core render to a Service

    todo: fix master volume implementation
 */

import { el, ElementaryWebAudioRenderer as core } from "@elemaudio/core-lite";
import { ControlWaves, FSM_STATE_ACTORS, Sound } from "../common/globals";
import { audioStore, speechEngine } from "../stores/audioStores";
import { machine, send, store } from "../stateMachinery/engineStateService";
import { speechStore } from "../stores/audioStores";
import { get, Writable } from "svelte/store";
import { Speech } from "./speech";
import { fsmToggle } from "../../lib/stores/fsmStoreNew";

const simpleSwitch = fsmToggle;


const fsm = { store: store, send: send, machine: machine }
const voiceGuide = new Speech()

interface AudioContextInfo {
  context: AudioContext,
  status: AudioContextState
}

export type Engine = {
  scrubGraphSound: Function
}

type Voice = { gate: number; freq: number; key: string }
type MonoWaveTable = { channelData: Float32Array; lengthInSamples: number; name: string }
export let waveTables: MonoWaveTable[] = []

abstract class AudioEngine {
  /**
   * @private there should only be one live AudioContext
   * and it needs to be kept open for the engine
   * to function in the app
   */
  private static ctx: AudioContext;

  /**
   *
   * @param ctx the live audio context
   * @protected Singleton constructor pattern
   */
  protected constructor(ctx: AudioContext) {
    AudioEngine.ctx = ctx
  }

  async asSamplesFile(filename: string):Promise<MonoWaveTable> {
    // validity check?
    const ctx = AudioEngine.ctx
    const source = ctx.createBufferSource();
    const res = await fetch(filename);

    await ctx.decodeAudioData( await res.arrayBuffer(), function(buffer) {
        source.buffer = buffer
        source.connect(ctx.destination);
      },
      function(e: DOMException){ console.log("Error with decoding audio data " + e.message); return e.code});

    const samples = source.buffer.getChannelData(0)
    const wt = { channelData: samples, lengthInSamples: samples.length, name: filename }
    waveTables.push( wt )
    return wt
  }

  /**
   * @protected Returns main audio context and operating information about it
   */
  protected getBaseAudioContext(): AudioContextInfo {
    return  { context: AudioEngine.ctx, status: AudioEngine.ctx.state } ;
  }

  /**
   * @param state
   * @protected a method to switch base audio context state
   */
  protected  setAudioContextState(state:AudioContextState) {
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

  /**
   *
   * @param baseACTX Main audio context
   * @protected Singleton instantiation of Elementary audio engine
   *
   */
  protected static getInstanceOfElementary( baseACTX: AudioContext) { return };

  /**
   * main audio engine validation, mounting and initialisation
   */
  abstract mount();

  /**
   *  mute the audio graph without closing context
   */
  abstract mute();

  /**
   * resume the main context , user interaction
   * is needed always before browser will play any audio.
   * Attach resume() to a UI button, to prompt user interaction
   */
  protected resume() { this.setAudioContextState('running') };

  abstract ping();
  protected static masterVolume: number;
  abstract setMasterVolume(volume: number);
}
/////////////////////////////////////////////////////////////////////////////////

class Elementary extends AudioEngine  {
  private static instance: Elementary;
  masterVolume: number;
  private actx: AudioContext;
  private sr: number
  private controlWaves: {
    sharp?: Array<number>,
    rand?: Array<number>,
    gaussian?: Array<number>
  }

  private constructor(baseACTX: AudioContext) {
    if (!baseACTX) throw new Error('Base AudioContext does not exist!')
    super(baseACTX);
    this.actx = super.getBaseAudioContext().context;
    this.masterVolume = 0.5;
    this.sr = this.actx.sampleRate
    this.controlWaves = {
      sharp: ControlWaves.EXP_ATTACK,
      rand: ControlWaves.RANDOM }
  }

  public static getInstanceOfElementary( baseACTX: AudioContext): Elementary {
    if (!Elementary.instance) {
      Elementary.instance = new Elementary(baseACTX);
    }
    return Elementary.instance;
  }

  protected setEngineState(newState) {
    fsm.send( {type: newState, data: FSM_STATE_ACTORS.STATE_CHANGE})
  }

  async mount() {
    if (!this.actx) return false;

    super.setAudioContextState('suspended')
    this.setEngineState('pause');
    const elementaryNode = await core.initialize(this.actx, {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [2],
      processorOptions: {
        virtualFileSystem: {
          "/static/waves/ShortSharpPoly.wav": await(super.asSamplesFile('waves/ShortSharpPoly.wav'))
            .then(( wt ) => wt.channelData)
        }
      }
    });


    core.on("load", (event) => {
      console.log("🔉 Elementary Audio ready -> " + Object.keys(event));
      audioStore.update(store => ({ ...store, elementaryReady: true, waveTables: waveTables }))
      console.log("connecting node graph to destination... max channel count: \t" + this.actx.destination.maxChannelCount);
      elementaryNode.connect(this.actx.destination);
    });
  }

  resume() {
    if(this.getMainContextStatus()==='running') return
    super.resume()
    audioStore.update(store => ({ ...store, contextState: 'running'  }))
  }

  getMainContext() {
    return super.getBaseAudioContext().context;
  }

  getMainContextStatus() {
    return super.getBaseAudioContext().status;
  }

  getEngineState() {
    return get(fsm.store).state
  }

  getUIEvent() {
      const uiActor =  get(fsm.store).context.actor
    return uiActor
    }

  setMasterVolume(volume: number) {
    this.masterVolume = Math.min(volume, Sound.MAX_VOLUME)
    const level = el.const( {value: this.masterVolume, key: 'master.Volume' } )
    const attenuated = el.sm( level )
    this.render( attenuated );
  }

  secToSamp ( periodInSecond )
  {
    console.log( periodInSecond * this.sr )
    return ( periodInSecond * this.sr )
  }

  stayOnFor ( on = 1, onDurationInSeconds = 1 ) {
    let oneShot = el.le(el.counter(on), el.mul(el.sr(), onDurationInSeconds))
    return oneShot
  }

  env (onOff) {
    let onOffSignal = el.const({key: 'onOff', value: onOff});
    let table = this.controlWaves.sharp
    let seqEnv = el.seq( {seq: table, hold: true, loop: false} , el.train(250), onOffSignal);

    return el.mul( el.sm( seqEnv ) )
  }

  ping( onOff:number = 1) {
      this.setMasterVolume(0.5);
      const ping = el.mul (
                        this.env( onOff ),
                        el.cycle((Date.now() % 24) + 3),
                        el.cycle(800)
        )

    this.render(  ping  )
  }

  scrubGraphSound(dataValue:number, dataSource?:string  )  {

    if (get(simpleSwitch)==='off') return;
    const engineState = get(store).state;
    const { isActive: voiceActive, latestUtterance } = get(speechStore)

    if ( voiceActive && (latestUtterance !== dataSource) ) this.say(dataSource)
    if (typeof dataValue !== 'number' ) { console.log( 'error in data' ); return }
    if (engineState===(Sound.PAUSED || Sound.UNMOUNTED)) return
    const gate =  0.25
    const click = el.mul(
                    el.cycle(
                        el.const( {value: dataValue + 130 , key: 'scrubPitch'} )
                      ),
                    el.sm(gate)
                  )
    const echo = ( src ) => {
      const input = el.dcblock(src)
      return (
          el.delay({ size: 44100, key: 'fx'}, el.ms2samps(123), 0.8, input)
      )
    }

    this.render( el.add( el.mul( 0.25, echo(click) ) ) )
  }

  say( text:string) {
    voiceGuide.speak(text)
  }

  render( sound ): void  {
    core.render(sound, sound)
  }

  mute() {
    this.render( el.const( {key: 'z' , value: 0} ) )
    this.setMasterVolume(0);
  }

}

export default Elementary;
