/// FSM machine in a Store based on code by @mui

import { Sound } from "../common/globals";
import { createMachineStore } from "../stores/fsmStore";
import { createMachine, state, transition } from "robot3";

type Event = {
  data: string
}

export function createAudioEngineStateMachine() {

  const context = (initialContext) => ( {actor: ''} );

  const states = {

    pause: state(
      transition('play', 'play')
    ),
    play: state(
      transition('pause', 'pause')
    )
  };

  const machine = createMachine(states, context);
  return createMachineStore(machine);
}

const { store, send, machine } = createAudioEngineStateMachine();
export { store, send, machine };
