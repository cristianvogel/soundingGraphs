// synth defs

import { el } from "@elemaudio/core";
import { echo } from "./effects";
import type { ElementaryNode, SynthCR } from "../../types/audio";
import { clamp } from "../common/dataUtils";
import { FuncGen } from "./control";
import { Waves } from "../common/globals";


const func = new FuncGen( Waves.EXP )
let delta = 0;
let ping: ElementaryNode;
export function GraphScrubSynth(
  {
    freq = 0,
    gate = 1,
    id = "scrubSynth"
  }: SynthCR): ElementaryNode {
      const onOff = el.const( {value: delta === freq ? 0 : gate, key: 'fq.changed'} )
      const absDerivative = clamp(Math.abs( freq - delta ), 100, 500)
      ping  = el.mul(
                    func.envelope( {onOff: onOff, durMS: 25, level: 0.4, env: Waves.EXP} ),
                    el.cycle( el.add( el.const( { value: clamp(freq, 100, 6000), key: 'scrubFreq'}) , 113 ) )
                )
      delta = freq;
      return (
        echo( {
          signal: ping,
          timeConstantMS: 123,
          id: `${id}-fx` })
      );
}



