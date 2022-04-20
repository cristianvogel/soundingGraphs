import { NodeRepr_t } from "@elemaudio/core";

export type SignalOrNumber = number | NodeRepr_t;

export type SynthSR = {
  freq: SignalOrNumber;
  gate: SignalOrNumber;
  id?: string;
  options?: { gain?: SignalOrNumber }
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
  onOff: SignalOrNumber,
  durMS?: number,
  env: string,
  interp?: boolean,
  level?: SignalOrNumber,
  reverse?: boolean
}
export interface FunctionGenerator {
  onOff: SignalOrNumber,
  durMS?: number,
  env?: string,
  interp?: boolean,
  level?: SignalOrNumber,
  envelope: ( EnvelopeOptions ) => SignalOrNumber
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

export type EffectParameters = {
  signal: SignalOrNumber,
  timeConstantMS: number,
  id?: string,
  feedback?: number,
  options?: { filter?: number }
}

export type MappedVoice = {
  index: number,
  language: string,
  voice: SpeechSynthesisVoice
}
