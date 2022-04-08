import { el } from "@elemaudio/core";
import { DEFAULT_TABLE_LENGTH } from "../common/globals";
import type { ElementaryNode, FunctionGenerator, SampleBuffer } from "../../types/audio";
import type { MonoWaveTable } from "../../types/audio";
import { msToHz, sampToMs } from "./helpers";
import { randomID } from "../common/dataUtils";

export function stayOnFor ( on = 1, onDurationInSeconds = 1 ) {
  let oneShot = el.le(el.counter(on), el.mul(el.sr(), onDurationInSeconds))
  return oneShot
}

//// computed wave tables with 0 as last sample
let expAttack: MonoWaveTable = {
  name: 'EXP_ATTACK',
  samples: Float32Array.from({ length: DEFAULT_TABLE_LENGTH }).map((_, i) => (i < DEFAULT_TABLE_LENGTH - 1) ? 1 / (i + 1) : 0),
  lengthInSamples: DEFAULT_TABLE_LENGTH
}

let randomWave: MonoWaveTable = {
  name: 'RANDOM_WAVE',
  samples: Float32Array.from({length: DEFAULT_TABLE_LENGTH}).map((_,i) => (i < DEFAULT_TABLE_LENGTH-1) ? Math.random() : 0),
  lengthInSamples: DEFAULT_TABLE_LENGTH
}

export const ControlWaves: Map<string, MonoWaveTable> = new Map()
  .set(expAttack.name, expAttack)
  .set(randomWave.name, randomWave)

export function getSampleDataForWaveTable(wt:string): Float32Array {
  return ControlWaves.has(wt) ? ControlWaves.get(wt).samples : null }


export function defaultRateFor(wt:string): number {
  return  (ControlWaves.has(wt) ?
    sampToMs(ControlWaves.get(wt).lengthInSamples)
    : 1 )
}

export function addControlWave( wt: MonoWaveTable ) {
  ControlWaves.set( wt.name || wt.tag, wt)
}

export function removeControlWave( wt: MonoWaveTable ) {
  if (ControlWaves.has(wt.name || wt.tag)) { ControlWaves.delete( wt.name || wt.tag ) }
}

export class FuncGen {
  private onOff: ElementaryNode | number ;
  private level: ElementaryNode | number = 1.0;
  private durMS: number;
  private env: string
  private nodeKey: string
  private table:SampleBuffer;
  private seqEnv: ElementaryNode;

  constructor( env: string, unique: boolean = true) {
    this.nodeKey = unique ? randomID() : env;
    this.table = getSampleDataForWaveTable( env )
    this.env = env
  }
  envelope( options : FunctionGenerator){
    if (this.env !== options.env) this.table = getSampleDataForWaveTable( options.env ) || this.table
    Object.assign(this, options)
    let levelSignal = (typeof this.level === "number") ? el.const( {key: `${this.nodeKey}.level`, value: this.level}) : this.level;
    let onOffSignal = (typeof this.onOff === "number") ? el.const({ key: `${this.nodeKey}.onOff`, value: this.onOff }) : this.onOff;

    const hz = msToHz(this.durMS * defaultRateFor(this.env)) * this.table.length;
    if (this.table) this.seqEnv = el.seq2({
        seq: Array.from(this.table),
        hold: true,
        loop: false},
      el.train( el.const( {value: hz , key: `${this.nodeKey}.hz`} ) ),
      onOffSignal );
    return ( el.mul( el.sm( this.seqEnv ), levelSignal ) )
  }

  dispose(){
    this.table = null
    this.env = null
    this.seqEnv = null
    this.nodeKey = null
  }
}

