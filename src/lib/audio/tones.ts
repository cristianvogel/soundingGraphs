// synth defs

import { el } from "@elemaudio/core";
import { echo } from "./effects";
import type { SignalOrNumber, BasicSynthVoice } from "../../types/audio";
import { clamp } from "../common/dataUtils";
import { FuncGen } from "./control";
import { Waves } from "../common/globals";

const envelope = Waves.EXP
const funcGens = [new FuncGen( envelope ), new FuncGen( envelope )]
let deltaMem:number[] = [0,0];
let ping: SignalOrNumber;
export function GraphScrubSynth(
  {
    freq = 0,
    gate = 1,
    id = "scrubSynth"
  }: BasicSynthVoice): SignalOrNumber {
      const deltaTest = (freq === deltaMem[1])
      const onOff = el.const( {value: deltaTest ? 0 : gate, key: `${id}-gate`} )
      ping  = el.mul(
                    funcGens[deltaTest ? 0 : 1].envelope( {onOff: onOff, durMS: 25, level: 0.15, env: envelope} ),
                    el.cycle( el.add( el.const( { value: clamp(freq, 100, 6000), key: `${id}-fq`}) , 113 ) )
                )
    deltaMem[1] = deltaMem[0]
    deltaMem[0] = freq

  //console.log(deltaMem)
      return (
        echo( {
          signal: ping,
          timeConstantMS: 123,
          id: `${id}-fx` })
      );
}



