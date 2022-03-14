/*
    Main audio engine glue.
    Initially have committed with Elementary.audio
    but may try to build HTML5 or some other WASM engine
    in the future

    todo: fix master volume implementation
 */

import {get, Writable, writable} from "svelte/store";
import {el as elem, ElementaryWebAudioRenderer as core} from '@elemaudio/core-lite';
import engineStateService from '../lib/stateMachinery/engineStateService.js'
import {Sound} from "../lib/Globals";

let masterVolumeNode;

abstract class AudioEngine {
    protected static ctx: AudioContext;
    protected static getBaseAudioContext(): AudioContext { return this.ctx };
    protected static setBaseAudioContext(ctx: AudioContext ) { this.ctx = ctx }
    protected static setState(s: string) { };
    protected static status: Writable<string>;
    protected static masterVolume: number;
    abstract setMasterVolume(volume: number): void;
    abstract mount();
    abstract mute();
    abstract resume();
    abstract getState();
    abstract ping( ): void;
    abstract getMasterVolume?(): number;
}

class Elementary extends AudioEngine implements AudioEngine {

    private readonly ctx: AudioContext;
    status: Writable<string> = writable('')
    masterVolume: number
    private toggleCounter: number = 1;

    constructor(ctx: AudioContext) {
        super();
        AudioEngine.setBaseAudioContext(ctx)
        this.ctx = AudioEngine.getBaseAudioContext()
        this.setState(Sound.MOUNTING);
        this.masterVolume = 0.707;
    };

    protected setState(newState: string) {
        this.status.set(Sound[newState])
        return this.getState()
    };

    setMasterVolume(volume: number) {
        this.masterVolume = Math.max(0, Math.min(volume, Sound.MAX_VOLUME));
        core.render(
            elem.sm(volume,volume)
        )
    };

    async mount() {
        if (!this.ctx) return false;

        masterVolumeNode = this.ctx.createGain();
        masterVolumeNode.gain.value = 0.9;
        masterVolumeNode.connect(this.ctx.destination);

        const elementaryNode =  await core.initialize(this.ctx, {
            numberOfInputs: 0,
            numberOfOutputs: 1,
            outputChannelCount: [2],
        });

        core.on("load", (event) => {
            console.log("🔉 Elementary Audio ready -> "+ Object.keys(event));
            this.setState(Sound.MOUNTED)
            console.log("connecting node graph...\t");
            elementaryNode.connect(masterVolumeNode);
        });
    };

    resume() {
        this.status.update(() => {
                let result;
                if (this.ctx) {
                    this.ctx.resume().then(r => result = r)
                    return Sound[result ? 'PLAYING' : 'PAUSED'];
                } else {
                    return Sound.ERROR
                }
            }
        )
    };

    getMainContext() {
        return AudioEngine.getBaseAudioContext();
    };

    getState() {
        return get(this.status)
    };

    async ping( reset: boolean = true ) {
        console.log('El: Ping')
        await this.resume()
        this.setMasterVolume(0.9)
        const noteOff =  setTimeout( ()=> elem.const(0), 500) || elem.const(1)
        let rm = elem.dcblock(elem.mul(
            elem.cycle((Date.now() % 24) + 3),
            elem.cycle(( 113 * 3)),
            elem.adsr( 0.05, 2, 0, 2, noteOff)
        ))
        core.render(
            elem.add(
            elem.delay({size: 44100}, elem.ms2samps(123), 0.8, rm),
                elem.delay({size: 44100}, elem.ms2samps(123 * 1.618), -0.8, rm)
            ));
    };

    mute() {
        console.log('El: Mute')
        this.setState(Sound.PAUSED)
        this.setMasterVolume(0)
    };

    getMasterVolume() {
        return this.masterVolume
    };

    ms2samp( ms: number ) { elem.ms2samps(ms) }
}

export default Elementary

