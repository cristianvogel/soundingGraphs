<script lang="ts">
  import Speaker from "../GraphicalExtras/Speaker.svelte";
  import { audioEngine, audioStore } from "../../lib/stores/audioStores";
  import { fsmToggle } from "../../lib/stores/fsmStoreNew";

  const simpleSwitch = fsmToggle;

  $: sounding = ($simpleSwitch === 'on');
  $: engine = audioEngine;

  function handleClick(e) {
      if (e.type === 'mouseup' ) {
        simpleSwitch.toggle();
        if ($simpleSwitch === 'off') mute()
      }

      ping(e.type === 'mousedown' ? 1 : 0);
  }

  function ping(onOff:number ) {
    $engine.resume();
    $engine.ping( onOff );
  }

  function mute() {
    if( $simpleSwitch === 'on' ) simpleSwitch.toggle()
    $engine.mute();
  }

</script>

{#if $audioStore.elementaryReady }
  <button class={ 'button is-rounded is-small is-' + (sounding ? 'danger' : 'light')} value={$simpleSwitch}
          on:mousedown={ handleClick }
          on:mouseup = { handleClick }
  ><Speaker/>{$simpleSwitch}</button>
  {:else }
  <button class={ 'button is-rounded is-small is-light is-loading'}></button>
{/if}
