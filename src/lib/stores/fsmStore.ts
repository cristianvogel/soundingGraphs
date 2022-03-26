// based on code by @miunau 🙏🏽

import type { Writable } from 'svelte/store';
import type { Machine, SendFunction } from 'robot3';
import { interpret } from 'robot3';
import { writable } from "svelte/store";


interface MachineStore {
  (machine: Machine, initialContext?: any): {
    store: Writable<{ state: string, context }>;
    send: SendFunction<any>;
    machine: Machine;
  };
}


/**
 * Wrap an FSM in a Svelte store
 * @param machine Robot3 state machine
 */
export const createMachineStore: MachineStore = (
  machine: Machine,
  initialContext?,
) => {
  const service = interpret(
    machine,
    (service) => {
      if (service.machine.current === 'error') {
        console.trace();

        console.error(
          'state',
          service.machine.current,
          'context',
          service.context,
        );
      } else {
        //console.log('state', service.machine.current, 'context', service.context);
      }
      store.set({ state: service.machine.current, context: service.context });
    },
    initialContext,
  );

  const store = writable({
    state: machine.current,
    context: service.context
  });

  const send = service.send;

  return { store, send, machine };
};

