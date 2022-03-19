/*
    Main audio engineStateMachine glue.
    Bit of a mess.
    Initially have committed with Elementary.audio
    but may try to build HTML5 or some other WASM engineStateMachine
    in the future

    todo: fix master volume implementation
    todo: actually use the engine state machine
 */

import { get, Writable, writable } from "svelte/store";
import {
  el as elem,
  ElementaryWebAudioRenderer as core,
} from "@elemaudio/core-lite";
import { Sound } from "../lib/Globals";
import { audioStore } from "../lib/stores/Stores";

let masterVolumeNode;

abstract class AudioEngine {
  private static ctx: AudioContext;
  protected constructor(ctx: AudioContext) {
    AudioEngine.ctx = ctx
  }
  protected static getBaseAudioContext(): AudioContext {
    return AudioEngine.ctx;
  }
  protected static setState(s: string) {}
  protected static status: Writable<string>;
  protected static masterVolume: number;
  protected static getInstanceOfElementary( baseACTX: AudioContext) {};
  abstract setMasterVolume(volume: number);
  abstract mount();
  abstract mute();
  abstract resume();
  abstract getState();
  abstract ping();
  abstract getMasterVolume?(): number;
}

class Elementary extends AudioEngine  {
  private static instance: Elementary;
  status: Writable<string> = writable("");
  masterVolume: number;
  private actx: AudioContext;

  private constructor(baseACTX: AudioContext) {
    super(baseACTX);
    this.actx = AudioEngine.getBaseAudioContext();
    this.setState(Sound.MOUNTING);
    this.masterVolume = 0.707;
  }

  public static getInstanceOfElementary( baseACTX: AudioContext): Elementary {
    if (!Elementary.instance) {
      Elementary.instance = new Elementary(baseACTX);
    }
    return Elementary.instance;
  }

  protected setState(newState: string) {
    this.status.set(Sound[newState]);
    return this.getState();
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

    const elementaryNode = await core.initialize(this.actx, {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [2],
    });

    core.on("load", (event) => {
      console.log("🔉 Elementary Audio ready -> " + Object.keys(event));
      this.setState(Sound.MOUNTED);
      audioStore.update(store => ({ ...store, elementaryReady: true }))
      console.log("connecting node graph to destination... max channel count: \t" + this.actx.destination.maxChannelCount);
      elementaryNode.connect(masterVolumeNode);
    });
  }

  resume() {
    this.status.update(() => {
      let result;
      if (this.actx) {
        this.actx.resume().then((r) => (result = r));
        return Sound[result ? "PLAYING" : "PAUSED"];
      } else {
        return Sound.SUSPENDED;
      }
    });
  }

  getMainContext() {
    return AudioEngine.getBaseAudioContext();
  }

  getState() {
    return get(this.status);
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
    this.setState(Sound.PAUSED);
    this.setMasterVolume(0);
  }

  getMasterVolume() {
    return this.masterVolume;
  }

  ms2samp(ms: number) {
    elem.ms2samps(ms);
  }
}

export default Elementary;
