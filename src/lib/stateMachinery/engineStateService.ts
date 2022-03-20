
/// FSM machine in a Store based on code by @mui

import {Sound} from "../Globals";
import { createMachineStore } from "../stores/fsmStore";
import { createMachine, guard, state, transition } from 'robot3';
type Event = {
    data: string
}

export function createAudioEngineStateMachine() {// initial data?
  const event = {};
  const context = (event) => {
  };

  const states = {

    [Sound.PAUSED]: state(
      transition("toggle", Sound.PLAYING,
        guard((ctx, event: Event) => event.data === "Ping")
      )
    ),
    [Sound.PLAYING]: state(
      transition("toggle", Sound.PAUSED,
        guard((ctx, event: Event) => event.data === "Mute")
      )
    )
  };

  const machine = createMachine(states, context);
  return createMachineStore(machine);
}

const { store, send, machine } = createAudioEngineStateMachine();
export { store, send, machine };
