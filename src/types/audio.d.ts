import { NodeRepr_t } from "@elemaudio/core";

export type ElementaryNode = number | NodeRepr_t;

export type SynthSR = {
  freq: ElementaryNode;
  gate: ElementaryNode;
  id?: string;
  options?: { gain?: ElementaryNode }
}

export type SynthCR = {
  freq: number;
  gate: number;
  id?: string;
  options?: { gain?: number }
}

export type SampleBuffer = Float32Array;

export type FunctionExpression = { expression: function }

export type EnvelopeOptions = {
  onOff: ElementaryNode,
  durMS?: number,
  env: string,
  interp?: boolean,
  level?: ElementaryNode
}
export interface FunctionGenerator {
  onOff: ElementaryNode,
  durMS?: number,
  env?: string,
  interp?: boolean,
  level?: ElementaryNode,
  envelope: ( EnvelopeOptions ) => ElementaryNode
}



export type AudioFileName = {
  url: string;
  category: 'wavetable' | 'sample' | 'multisample';
  local?: boolean ;
  tag?: string
}

export type MonoWaveTable = {
  name: string;
  samples: Float32Array;
  lengthInSamples: number;
  sampleRate?: number;
  tag?: string
}

export type MonoSampleFile = {
  name: string;
  samples: Float32Array;
  sampleRate: number;
  lengthInSamples: number;
  metadata?: {
    basePitch?: string;
    defaultVolume?: number;
    loop?: boolean;
    tag?: string
  }
}

export type NoisyArrayOptions = {
  size: number,
  step: number,
  initialOffset?: number,
  fullRange?: boolean
}

export type NoiseStreamOptions = {
  step?: number,
  initialOffset?: number,
  fullRange?: boolean
}
