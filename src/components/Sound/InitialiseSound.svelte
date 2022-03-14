<script lang="ts">
    import {get, Writable} from "svelte/store";
    import stores from "../../lib/stores/Stores";
    import type AudioEngine from "../../script/audioEngine";
    import {Sound} from "../../lib/Globals";
    import engineStateService from "../../lib/stateMachinery/engineStateService"
    import type Machine from "robot3"

    const engine: Writable<Machine> = engineStateService
    $: send = $engine.send
    $: currentEngineState = $engine.machine.current
    $: soundingStatus = $engine.machine.current === Sound.PLAYING || false

    const wait = (f, ms) => setTimeout(f, ms);

    function handleClick(e) {
        if (currentEngineState === Sound.PAUSED) {
            ping()
        } else {
            mute()
        }
    }

      function ping() {
         const actx: AudioContext = get(stores.__actx)
         const engine: AudioEngine = get(stores.__audioEngine)
         if (actx && engine.getState() !== Sound.UNMOUNTED) {
             engine.resume()
             engine.ping()
             send({type: 'toggle', data: 'Ping'})
              wait(mute, 3000)
         }
     }

     function mute() {
        const engine: AudioEngine = get(stores.__audioEngine)
        engine.mute()
        send({type: 'toggle', data: 'Mute'})
    }

</script>
{#if currentEngineState !== Sound.UNMOUNTED}
    <button class={ 'button is-rounded is-small is-' + (soundingStatus ? 'danger' : 'light')}
            on:click={ handleClick }
    >Ping
    </button>
{/if}
