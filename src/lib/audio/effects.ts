// effects

import { el } from "@elemaudio/core";
import type { EffectParameters, ElementaryNode } from "../../types/audio";

// ' Dual Echo effect with DC block'
export function echo({ signal, timeConstantMS = 180, id = "echo", feedback = 0.8 }: EffectParameters
): ElementaryNode {
  const signalNoDC = el.dcblock(signal);
  return (
    el.delay(
      { size: 44100, key: id },
      el.ms2samps(timeConstantMS),
      feedback,
      signalNoDC)
  );
}

