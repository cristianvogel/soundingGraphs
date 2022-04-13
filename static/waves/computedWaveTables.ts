//// computed wave tables with 0 as last sample
import type { MonoWaveTable, FunctionExpression } from "../../src/types/audio";
import { DEFAULT_TABLE_LENGTH, Waves } from "../../src/lib/common/globals";
import { PerlinNoiseStream } from "../../src/script/perlinNoise";
import { gaussian, IRandom, SYSTEM } from "@thi.ng/random";

const Random: IRandom =  SYSTEM

let generateSamplesFrom = function( { expression }: FunctionExpression ) {
  const f = Float32Array.from({ length: DEFAULT_TABLE_LENGTH })
                        .map((_, i) => expression(i) || 0 );
  return endWithZero(f)
};

function endWithZero(arr:Float32Array){
    arr.set([0], arr.length-1);
  return arr }

let expAttack: MonoWaveTable = {
  name: Waves.EXP,
  samples: generateSamplesFrom( { expression: ( i ) => 1/(i+1) } ),
  lengthInSamples: DEFAULT_TABLE_LENGTH,
  tag: Waves.EXP
}

let revExp: MonoWaveTable = {
  name: Waves.REV_EXP,
  samples: generateSamplesFrom( { expression: ( i ) => 1.25 - (1/(i+1)) } ),
  lengthInSamples: DEFAULT_TABLE_LENGTH,
  tag: Waves.REV_EXP
}

let randomGauss: MonoWaveTable = {
  name: Waves.RANDOM_GAUSS,
  samples: generateSamplesFrom ( {expression: gaussian(Random, 24, 0.5) } ),
  lengthInSamples: DEFAULT_TABLE_LENGTH,
  tag: Waves.RANDOM_GAUSS
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
  [ randomGauss.tag, randomGauss ],
  [ perlinWave.tag, perlinWave ],
  [ revExp.tag, revExp]
])

