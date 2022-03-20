/*
    Main audio engineStateMachine glue.
    Move Elementary.core render to a Service

    todo: fix master volume implementation
    todo: actually use the engine state machine here
 */

import { get } from "svelte/store";
import {
  el as elem,
  ElementaryWebAudioRenderer as core,
} from "@elemaudio/core-lite";
import { Sound } from "../lib/Globals";
import { audioStore } from "../lib/stores/Stores";
import { store, send, machine } from "../lib/stateMachinery/engineStateService";

let masterVolumeNode;
const fsm = { store: store, send: send, machine: machine }

interface AudioContextInfo {
  context: AudioContext,
  status: AudioContextState
}

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
     switch (state) {
       case "closed": AudioEngine.ctx.close()
         break
       case "suspended": AudioEngine.ctx.suspend()
         break
       case "running": AudioEngine.ctx.resume()
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

  abstract getEngineState();
  abstract ping();
  protected static masterVolume: number;
  abstract setMasterVolume(volume: number);
}

class Elementary extends AudioEngine  {
  private static instance: Elementary;
  masterVolume: number;
  private actx: AudioContext;

  private constructor(baseACTX: AudioContext) {
    if (!baseACTX) throw new Error('Base AudioContext does not exist!')
    super(baseACTX);
    this.actx = super.getBaseAudioContext().context;
    this.masterVolume = 0.707;
  }

  public static getInstanceOfElementary( baseACTX: AudioContext): Elementary {
    if (!Elementary.instance) {
      Elementary.instance = new Elementary(baseACTX);
    }
    return Elementary.instance;
  }

  protected setEngineState(newState: Sound) {
    fsm.send( {type: newState.toString(), data: 'statusChange'})
  }

  setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(volume, Sound.MAX_VOLUME));
    core.render(elem.sm(volume, volume));
  }

  async mount() {
    if (!this.actx) return false;

    masterVolumeNode = this.actx.createGain();
    masterVolumeNode.gain.value = this.masterVolume;
    masterVolumeNode.connect(this.actx.destination);
    super.setAudioContextState('suspended')

    const elementaryNode = await core.initialize(this.actx, {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [2],
    });


    core.on("load", (event) => {
      console.log("🔉 Elementary Audio ready -> " + Object.keys(event));
      this.setEngineState(Sound.MOUNTED);
      audioStore.update(store => ({ ...store, elementaryReady: true }))
      console.log("connecting node graph to destination... max channel count: \t" + this.actx.destination.maxChannelCount);
      elementaryNode.connect(masterVolumeNode);
    });
  }

  resume() {
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
    return fsm.machine.current
  }

  async ping(reset: boolean = true) {
    console.log("El: Ping");
    await this.resume();
    this.setMasterVolume(0.9);
    const noteOff = setTimeout(() => elem.const(0), 500) || elem.const(1);
    let rm = elem.dcblock(
      elem.mul(
        elem.cycle((Date.now() % 24) + 3),
        elem.cycle(113 * 3),
        elem.adsr(0.05, 2, 0, 2, noteOff)
      )
    );
    core.render(
      elem.add(
        elem.delay({ size: 44100 }, elem.ms2samps(123), 0.8, rm),
        elem.delay({ size: 44100 }, elem.ms2samps(123 * 1.618), -0.8, rm)
      )
    );
  }

  mute() {
    console.log("El: Mute");
    this.setEngineState(Sound.PAUSED);
    this.setMasterVolume(0);
  }

}

export default Elementary;
