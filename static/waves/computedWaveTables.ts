//// computed wave tables with 0 as last sample
import type { MonoWaveTable, FunctionExpression } from "../../src/types/audio";
import { DEFAULT_TABLE_LENGTH, Waves } from "../../src/lib/common/globals";
import { PerlinNoiseStream } from "../../src/script/perlinNoise";

let generateSamplesFrom = function( { expression }: FunctionExpression ) {
  return Float32Array.from({ length: DEFAULT_TABLE_LENGTH }).map((_, i) => (i < DEFAULT_TABLE_LENGTH - 1) ? expression(i) : 0);
};

let expAttack: MonoWaveTable = {
  name: Waves.EXP,
  samples: generateSamplesFrom( { expression: ( i ) => 1/(i+1) } ),
  lengthInSamples: DEFAULT_TABLE_LENGTH,
  tag: Waves.EXP
}

let randomWave: MonoWaveTable = {
  name: Waves.RANDOM,
  samples: generateSamplesFrom ( {expression: () => Math.random()} ),
  lengthInSamples: DEFAULT_TABLE_LENGTH,
  tag: Waves.RANDOM
}
const noiseFunc = new PerlinNoiseStream( {step: 0.02})
let perlinWave: MonoWaveTable = {
  name: Waves.PERLIN,
  samples: generateSamplesFrom ( {expression: () => noiseFunc.next()} ),
  lengthInSamples: DEFAULT_TABLE_LENGTH,
  tag: Waves.PERLIN
}

export const ComputedWaveTables: Map<string, MonoWaveTable> = new Map([
  [ expAttack.tag, expAttack ],
  [ randomWave.tag, randomWave ],
  [ perlinWave.tag, perlinWave ]
])
