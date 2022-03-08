import {get, Writable, writable} from "svelte/store";
import {ElementaryWebAudioRenderer as core, el} from '@elemaudio/core-lite';

let masterVolumeNode;

export enum Sound {
    UNMOUNTED= 'UNMOUNTED',
    MOUNTING = 'MOUNTING',
    MOUNTED = 'MOUNTED',
    PAUSED = 'PAUSED',
    PLAYING = 'PLAYING',
    ERROR = 'ERROR',
    MAX_VOLUME = 0.8
}

abstract class AudioEngine {
    protected static ctx: AudioContext;
    protected static setState(s: string) { };
    protected static state: Writable<string>;
    protected static masterVolume: number;
    static setMasterVolume(volume: number): void { } ;
    abstract mount();
    abstract mute();
    abstract resume();
    abstract getState();
    abstract getMainContext?(): AudioContext;
    abstract ping?(): void;
    abstract getMasterVolume?(): number;
}

class Elementary implements AudioEngine {

    constructor(ctx: AudioContext) {
        this.ctx = ctx;
        this.setState(Sound.MOUNTING);
        this.masterVolume = 0.707;
    };

    masterVolume: number;
    state: Writable<string> = writable('');
    ctx: AudioContext

    protected setState(newState: string) {
        this.state.set(Sound[newState])
        return this.getState()
    };

    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(volume, Sound.MAX_VOLUME));
        core.render(el.sm(volume,volume) )
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
        this.state.update(() => {
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
        return this.ctx;
    };

    getState() {
        return get(this.state)
    };

    async ping() {
        console.log('El: Ping')
        await this.resume()
        this.setMasterVolume(0.9)
        core.render(el.mul(el.cycle(Date.now() % 16), el.cycle(128)));
    };

    mute() {
        console.log('El: Mute')
        this.setState(Sound.PAUSED)
        this.setMasterVolume(0)
    };

    getMasterVolume() {
        return this.masterVolume
    };
}

export default Elementary
