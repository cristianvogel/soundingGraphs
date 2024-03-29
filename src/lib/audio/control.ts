import { el, NodeRepr_t, resolve } from "@elemaudio/core";
import type { SignalOrNumber, EnvelopeOptions, FunctionGenerator, SampleBuffer } from "../../types/audio";
import type { MonoWaveTable } from "../../types/audio";
import { msToHz, sampToMs } from "./helpers";
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

export function smootherStep( signal:SignalOrNumber){
  return el.smooth(el.tau2pole(0.01), signal)
}
export class FuncGen implements FunctionGenerator{
   onOff: SignalOrNumber  ;
   level: SignalOrNumber;
   durMS: number;
   hz: number;
   env: string;
   nodeKey: string;
   table: SampleBuffer;
   seqEnv: SignalOrNumber;

  constructor( env: string, unique: boolean = true ) {
    this.table = getSampleDataForWaveTable(env)
    this.nodeKey = unique ? Date.now().toPrecision(4) : 'funcGen';
    this.env = env
  }

  envelope( options: EnvelopeOptions): NodeRepr_t {
      if (this.env !== options.env) {
        this.table = getSampleDataForWaveTable( options.env ) || this.table
      }
      if (options.reverse) this.table.reverse()
      Object.assign(this, options)
      return (this._envelope())
  }

  private _envelope() : NodeRepr_t {
    // if (this.env !== options.env) {this.table = getSampleDataForWaveTable( options.env ) || this.table}
    // if (options.reverse) this.table.reverse()
    // Object.assign(this, options)
    let levelSignal = resolve(this.level) //el.const( {key: `${this.nodeKey}.level`, value: this.level}) : this.level;
    let onOffSignal = resolve(this.onOff) //(typeof this.onOff === "number") ? el.const({ key: `${this.nodeKey}.onOff`, value: this.onOff }) : this.onOff;
    // let hz = msToHz(this.durMS * defaultRateFor(this.env)) * (AudioEngine.getBaseContextInfo().sampleRate / (this.table.length || DEFAULT_TABLE_LENGTH))
    // // this.seqEnv = el.sample( {key: this.nodeKey, data: this.table, channel: 0, mode: 'trigger'}, onOffSignal, 1)
      this.seqEnv = el.seq2({
          seq: Array.from(this.table),
          hold: true,
          loop: false
        },
        el.train(resolve(msToHz(this.durMS))),
        onOffSignal);
      return resolve(el.mul( smootherStep( this.seqEnv ), levelSignal))
  }

}

