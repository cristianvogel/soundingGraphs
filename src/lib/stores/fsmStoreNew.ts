import { writable } from "svelte/store";
import fsm from 'svelte-fsm'
/**
 * Wrap an FSM in a Svelte store
 * @param machine Robot3 state machine
 */

type State = {
  state: string
}

type SimpleSwitch = {
  initial:  ('off' | 'on') ,
  states: {
    off: { toggle: ('on') },
    on: { toggle: ('off') }
  }
}

const { initial, states }: SimpleSwitch = {
  initial: 'off',
  states: {
    on: { toggle: 'off' },
    off: { toggle: 'on' }
  }
}

export const fsmToggle = fsm( initial, states )

