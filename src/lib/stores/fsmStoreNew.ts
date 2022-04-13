
import fsm from 'svelte-fsm'

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

export const soundToggle = fsm( initial, states )

