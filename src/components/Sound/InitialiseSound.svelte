<script lang="ts">
  import Speaker from "../GraphicalExtras/Speaker.svelte";
  import { FSM_STATE_ACTORS, Sound } from "../../lib/common/globals";
  import { audioEngine, audioStore } from "../../lib/stores/audioStores";
  import { send, store } from "../../lib/stateMachinery/engineStateService";

  $: sounding = ($store.state === Sound.PLAYING);
  $: engine = audioEngine;

  let currentTimer;

  function handleClick(e) {
      ping(e.type === "mousedown" ? 1 : 0);
      pauseAfter( 500 )
  }

  function ping(onOff:number ) {
    send('play')
    $engine.resume();
    $engine.ping( onOff );
  }

  function mute() {
    send('pause')
    $engine.mute();
  }

  function pause() {
    send('pause')
  }

  function muteAfter(millis ) {
    if(currentTimer) clearTimeout(currentTimer)
    currentTimer = setTimeout(mute, millis)
  }

  function pauseAfter(millis ) {
    if(currentTimer) clearTimeout(currentTimer)
    currentTimer = setTimeout(pause, millis)
  }

</script>

{#if $audioStore.elementaryReady }
  <button class={ 'button is-rounded is-small is-' + (sounding ? 'danger' : 'light')}
          on:mouseup = { handleClick }
          on:mousedown={ handleClick }
  ><Speaker/></button>
  {:else }
  <button class={ 'button is-rounded is-small is-light is-loading'}></button>
{/if}
