// synth defs

import { el } from "@elemaudio/core";
import { Effects } from "./effects";
import type { ElementaryNode, SynthCR } from "../../types/audio";
import { clamp } from "../common/dataUtils";
import { FuncGen } from "./control";

const { echo } = Effects;
const func = new FuncGen( 'EXP_ATTACK', false )
let delta = 0;
let ping: ElementaryNode;
export function GraphScrubSynth(
  {
    freq = 0,
    gate = 1,
    id = "scrubSynth"
  }: SynthCR): ElementaryNode {
      const onOff = el.const( {value: delta === freq ? 0 : gate, key: 'fq.changed'} )

      ping  = el.mul(
                    func.envelope( {onOff: onOff, durMS: 10, level: 1.5} ),
                    el.cycle( el.add( el.const( { value: clamp(freq, 100, 6000), key: 'scrubFreq'}) , 113) )
                )
        delta = freq;
      return ( echo(ping, 123, `${id}-fx`) );
}



