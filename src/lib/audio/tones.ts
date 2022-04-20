// synth defs

import { el } from "@elemaudio/core";
import { echo } from "./effects";
import type { SignalOrNumber, SynthCR } from "../../types/audio";
import { clamp } from "../common/dataUtils";
import { FuncGen } from "./control";
import { Waves } from "../common/globals";


const func = new FuncGen( Waves.EXP )
let deltaMem:number[] = [2];
let ping: SignalOrNumber;
export function GraphScrubSynth(
  {
    freq = 0,
    gate = 1,
    id = "scrubSynth"
  }: SynthCR): SignalOrNumber {
      const onOff = el.const( {value: deltaMem[1] - deltaMem[0], key: `${gate}-graphFq`} )
      const absDerivative = clamp(Math.abs( freq - deltaMem[1] ), 100, 500)
      ping  = el.mul(
                    func.envelope( {onOff: onOff, durMS: 25, level: 0.15, env: Waves.EXP} ),
                    el.cycle( el.add( el.const( { value: clamp(freq, 100, 6000), key: 'scrubFreq'}) , 113 ) )
                )

    deltaMem[1] = deltaMem[0]
    deltaMem[0] = freq;
      return (
        echo( {
          signal: ping,
          timeConstantMS: 123,
          id: `${id}-fx` })
      );
}



