// effects

import { el, NodeRepr_t } from "@elemaudio/core";

type Node = number | NodeRepr_t;

export type Effect = ((
  signal: Node,
  timeConstantMS: number,
  id?: string,
  options?: { filter?: number } & any,
) => Node) & { desc: string };

export const Echo: Effect = ( signal , timeConstantMS = 180, id = 'echo' ) => {
  const signalNoDC = el.dcblock( signal )
  return (
    el.delay({ size: 44100, key: id}, el.ms2samps(timeConstantMS), 0.8, signalNoDC)
  )
}

Echo.desc = 'Preset Dual Echo effect with DC block'

export const Effects: Record<string, Effect> = {
  echo: Echo
};
