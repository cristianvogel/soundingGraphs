<script lang="ts">
  import { audioEngine } from "../../lib/stores/audioStores";
  import { Sound } from "../../lib/Globals";
  import { send, store } from "../../lib/stateMachinery/engineStateService";
  import Speaker from "../GraphicalExtras/Speaker.svelte";

  $: currentEngineState = $store.state;
  $: soundingStatus = currentEngineState === Sound.PLAYING || false;
  $: engine = audioEngine;

  const timer = { set: (f, ms) => setTimeout(f, ms), clear: () => clearTimeout() }
  let currentTimer;

  function handleClick(e) {
    if (currentEngineState === Sound.PAUSED) {
      pingTest();
    } else {
      mute();
    }
  }

  function pingTest() {
    $engine.resume();
    $engine.ping();
    send({ type: "toggle", data: "Ping" })
    if(currentTimer) timer.clear()
    currentTimer = timer.set(mute, 3000)
  }

  function mute() {
    $engine.mute();
    send({ type: "toggle", data: "Mute" })
  }

</script>

{#if currentEngineState !== Sound.UNMOUNTED}
  <button class={ 'button is-rounded is-small is-' + (soundingStatus ? 'danger' : 'light')}
          on:click={ handleClick }
  ><Speaker/>
  </button>
{/if}
