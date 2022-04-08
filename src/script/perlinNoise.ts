// functions to fill arrays for testing or otherwise

import { perlin2D } from "@leodeslf/perlin-noise";
import type { NoisyArrayOptions, NoiseStreamOptions } from "../types/audio";

export function perlinNoiseArray(
  {
    size = 64,
    step = 0.02,
    initialOffset = 0,
    fullRange = false
  }: NoisyArrayOptions
) {
  const noiseFunc = perlin2D;
  let result = [];
  for (let i = 0; i < size; i++) {
    const s = i * step + initialOffset;
    let val = noiseFunc(size / (s + 0.1), s);
    if (!fullRange) val = val / 2 + 0.5; // scale and offset to 0-1
    result.push(val);
  }
  return result || [0];
}

export class PerlinNoiseStream {

  private step; initialOffset = 0; fullRange = true; location; noiseFunc;
  constructor( options: NoiseStreamOptions) {
    Object.assign(this, options)
    this.location = this.initialOffset;
    this.noiseFunc = perlin2D
  }

  next( step?: number ) {
    if (step && this.step !== step ) this.step = step;
    this.location += this.step
    let val = this.noiseFunc(this.location * (this.step/100), this.location )
    val = this.fullRange ? val / 2 + 0.5 : val;
    return val
  }
}
