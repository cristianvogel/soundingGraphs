import { el } from "@elemaudio/core";
import type { ElementaryNode, EnvelopeOptions, FunctionGenerator, SampleBuffer } from "../../types/audio";
import type { MonoWaveTable } from "../../types/audio";
import { msToHz, sampToMs } from "./helpers";
import { randomID } from "../common/dataUtils";
import { ComputedWaveTables } from "../../../static/waves/computedWaveTables";

export const ControlWaves: Map<string, MonoWaveTable> = ComputedWaveTables

export  function getSampleDataForWaveTable(wt:string): SampleBuffer | null {
  if (!wt) return null
//
  return (ControlWaves.has(wt) ? ControlWaves.get(wt).samples : null)
}

//todo: this isn't actually the right calculation yet
// want to figure out a rate scale factor ( to multiply with a hz cycle)
// for conforming arbitrary wavetable lengths
export function defaultRateFor(wt:string): number {
  return  (ControlWaves.has(wt) ?
    sampToMs(ControlWaves.get(wt).lengthInSamples)
    : 1 )
}

export function addControlWave( wt: MonoWaveTable ) {
  ControlWaves.set( wt.tag || wt.name, wt)
}

export function removeControlWave( wt: MonoWaveTable ) {
  if (ControlWaves.has(wt.name || wt.tag)) { ControlWaves.delete( wt.name || wt.tag ) }
}

export function smootherStep( signal:ElementaryNode){
  return el.smooth(el.tau2pole(0.01), signal)
}
export class FuncGen implements FunctionGenerator{
   onOff: ElementaryNode | number ;
   level: ElementaryNode | number = 0.75;
   durMS: number;
   env: string
   nodeKey: string
   table: SampleBuffer;
   seqEnv: ElementaryNode;

  constructor( env: string, unique: boolean = true ) {
    this.table = getSampleDataForWaveTable(env)
    this.nodeKey = unique ? randomID() : env;
    this.env = env
    this.seqEnv = el.const( {key: this.nodeKey, value: 0} )
  }
  public envelope( options : EnvelopeOptions ) : ElementaryNode {
    if (this.env !== options.env) {this.table = getSampleDataForWaveTable( options.env ) || this.table}
    if (options.reverse) this.table.reverse()
    Object.assign(this, options)
    let levelSignal = (typeof this.level === "number") ? el.const( {key: `${this.nodeKey}.level`, value: this.level}) : this.level;
    let onOffSignal = (typeof this.onOff === "number") ? el.const({ key: `${this.nodeKey}.onOff`, value: this.onOff }) : this.onOff;
    let hz = msToHz(this.durMS * defaultRateFor(this.env)) * (48000 / (this.table.length || 512))
      this.seqEnv = el.seq2({
          seq: Array.from(this.table),
          hold: true,
          loop: false
        },
        el.train(el.const({ value: hz, key: `${this.nodeKey}.hz` })),
        onOffSignal);
      return ( el.mul( smootherStep( this.seqEnv ), levelSignal ) )
  }

  public dispose(){
    console.log( 'disposing?')
    this.table = null
    this.env = null
    this.seqEnv = null
    this.nodeKey = null
  }
}

