/// FSM machine in a Store based on code by @mui

import { FSM_STATE_ACTORS, Sound } from "../common/globals";
import { createMachineStore } from "../stores/fsmStore";
import { createMachine, action, guard, state, transition, immediate } from "robot3";

type Event = {
  data: string
}


export function createAudioEngineStateMachine() {// initial data?

  const context = (initialContext) => ( {actor: ''} );

  function updateActor( ctx, event ) {
    ctx.actor = event.data
    if (store) {
      store.update( store => ( { ...store, context: ctx } ) )
    }
  }

  const states = {

    [Sound.PAUSED]: state(
      transition('play', Sound.PLAYING
      )
    ),
    [Sound.PLAYING]: state(
      transition('pause', Sound.PAUSED
      )
    )
  };

  const machine = createMachine(states, context);
  return createMachineStore(machine);
}

const { store, send, machine } = createAudioEngineStateMachine();

export { store, send, machine };
