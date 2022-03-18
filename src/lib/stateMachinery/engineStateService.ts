//   example integration with https://thisrobot.life
// supports send, context, and machine (to include machine.current & machine.state)

/// store
import * as robot from 'svelte-robot-factory';
import {createMachine, state, transition, invoke, Machine, guard} from 'robot3';
import {Sound} from "../Globals";

type Event = {
    data: string
}


const event = { };

const context = (event) => {};

const machinery:Machine = createMachine({

    [Sound.PAUSED]: state(
        transition('toggle', Sound.PLAYING,
            guard( (ctx, event:Event)=> event.data  === 'Ping' )
                )
            ),
    [Sound.PLAYING]: state(
        transition('toggle', Sound.PAUSED,
            guard( (ctx, event:Event)=> event.data  === 'Mute' )
        )
        )},
  context);

const engineStateService = robot.useMachine(machinery, event);
export default engineStateService;
