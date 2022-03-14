import {Readable, readable, Writable, writable} from "svelte/store";
import {interpolateGreys, interpolateRainbow} from "d3-scale-chromatic";
import {color} from "d3-color";
import type AudioEngine from "../../script/audioEngine";


 export type GeneralStores = {
    __tableViewState: Function,
    __colourMapping: () => Readable<Object>,
     __actx:Writable<AudioContext>,
     __audioEngine:Writable<AudioEngine>,
     __scopeSignals: Writable<number[]>
}

const stores:GeneralStores =
{
    //graphics
      __tableViewState: ():Writable<boolean> => writable(true),
      __colourMapping: () => readable({
            bg: (n) => color(interpolateRainbow(n ** 2)),
            bgDarker: (n, factor = 0.5) => color(interpolateRainbow(n ** 2)).darker(factor),
            bgBrighter: (n, factor = 1.5) => color(interpolateRainbow(n ** 2)).brighter(factor),
            fg: (n) => color(interpolateRainbow(n ** 0.5)),
            greys: (n) => color(interpolateGreys(n))
    }),

    //audio
    __actx: writable(),
    __audioEngine: writable(),
    __scopeSignals: writable([])
}

export default stores
