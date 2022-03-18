// functions to fill arrays for testing or otherwise

import { perlin2D } from "@leodeslf/perlin-noise";

export function noise(
  size = 64,
  step = 0.02,
  initialOffset = 0,
  fullRange = false
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
