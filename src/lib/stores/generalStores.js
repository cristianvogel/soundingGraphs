import {readable, writable} from "svelte/store";
import {interpolateRainbow} from "d3-scale-chromatic";
import {color} from "d3-color";

// table related
export const __tableViewState = () => writable( true )
export const __colourMapping = () => readable(		{
    bg: (n) => color(interpolateRainbow(n ** 2)),
    bgDarker: (n) => color(interpolateRainbow(n ** 2)).darker(0.5)
} )

