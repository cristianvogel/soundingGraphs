<script lang="ts">
  import Speaker from "../GraphicalExtras/Speaker.svelte";
  import { audioEngine, audioStore } from "../../lib/stores/audioStores";
  import { soundToggle } from "../../lib/stores/fsmStoreNew";
  import { fastSin } from "@thi.ng/math";

  const simpleSwitch = soundToggle;
  let size ;
  let interval;

  $: sounding = ($simpleSwitch === 'on');
  $: engine = audioEngine;

  function handleClick(e) {
      if (e.type === 'mouseup' ) {
        simpleSwitch.toggle();
        if ($simpleSwitch === 'off') mute()
      }

      ping(e.type === 'mousedown' ? 1 : 0);
  }
  function speakerThrob(){
    size = (2+ fastSin(1.0e-3 * Date.now()%360))
    if (sounding) { clearInterval(interval); size = 1.5 }

  }
  function ping(onOff:number ) {
    $engine.ping( onOff );
  }

  function mute() {
    if( $simpleSwitch === 'on' ) simpleSwitch.toggle()
    $engine.mute();
  }

  interval = setInterval( speakerThrob, 80 )

</script>

{#if $audioStore.elementaryReady }
  <button class={ 'button is-rounded is-small is-' + (sounding ? 'warning' : 'light')} value={$simpleSwitch}
          on:mousedown={ handleClick }
          on:mouseup = { handleClick }
  >Audio <Speaker size="{interval ? size : 2}"/>{$simpleSwitch}</button>
  {:else }
  <button class={ 'button is-rounded is-small is-light is-loading'}></button>
{/if}
