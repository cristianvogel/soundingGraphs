<script lang="ts">
     import { audioEngine } from "../../lib/stores/Stores";
     import {Sound} from "../../lib/Globals";
     import { send, machine } from "../../lib/stateMachinery/engineStateService";

    $: sendEvent = send
    $: currentEngineState = machine.current
    $: soundingStatus = machine.current === Sound.PLAYING || false
    $: engine = audioEngine

    const wait = (f, ms) => setTimeout(f, ms);

    function handleClick(e) {
        if (currentEngineState === Sound.PAUSED) {
            pingTest()
        } else {
            mute()
        }
    }

      function pingTest() {
          $engine.resume()
          $engine.ping()
          sendEvent({type: 'toggle', data: 'Ping'})
          wait(mute, 3000)
     }

     function mute() {
         $engine.mute()
         send({type: 'toggle', data: 'Mute'})
    }

</script>

{#if currentEngineState !== Sound.UNMOUNTED}
    <button class={ 'button is-rounded is-small is-' + (soundingStatus ? 'danger' : 'light')}
            on:click={ handleClick }
    >Ping
    </button>
{/if}
