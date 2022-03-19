// class implementing d3 colour schemes

import {interpolateGreys, interpolateRainbow} from "d3-scale-chromatic";
import {color} from "d3-color";

export class ColourMapping {

  bg = (n) => color(interpolateRainbow(n ** 2))

  bgDarker = (n, factor = 0.5) => {
    color(interpolateRainbow(n ** 2)).darker(factor)
  }

  bgBrighter = (n, factor = 1.5) => {
    color(interpolateRainbow(n ** 2)).brighter(factor)
  }

  fg = (n) => color(interpolateRainbow(n ** 0.5))

  greys = (n) => color(interpolateGreys(n))
}
