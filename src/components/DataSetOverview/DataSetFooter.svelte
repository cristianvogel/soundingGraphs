<script>
    import Hint from "svelte-hint";
    import {globStyle} from '../../assets/styleDefs.js'
    import {fade} from 'svelte/transition';
    import {rowCount} from "$lib/common/dataUtils.ts";
    import {getContext} from "svelte";
    import Icon from '@iconify/svelte';
    import { audioEngine, audioStore } from "../../lib/stores/audioStores";
    import { send, store } from "../../lib/stateMachinery/engineStateService";
    import { FSM_STATE_ACTORS, Sound } from "../../lib/common/globals";

    $: currentEngineState = $store.state;
    $: sounding = (currentEngineState === Sound.PLAYING) || false;
    $: engine = audioEngine;

    let currentTimer;

    async function handleClick(e) {
        console.log( `click state ${e.type} ${currentEngineState}`)
        ping(e.type === "mousedown" ? 1 : 0);
    }

    function ping( onOff ) {
        send({ type: 'play', data: FSM_STATE_ACTORS.SONIFY_BUTTON })
        $engine.resume();
        $engine.ping( onOff );
    }

    export let data = {}
    export let page = {};

    const {toggleView, visible} = getContext('table.status')
    const {inc, dec} = getContext('table.jump')
    const numberRows = rowCount(data);
    const wait = (f, ms) => setTimeout(f, ms);

    function handleSonifyClick( e ) {
        ping(e.type === "mousedown" ? 1 : 0);
    }


</script>

<div class="box">
    <div class="navbar" style="z-index: 0">
        <div class="navbar-start p-2">
            <Hint>
                <button class="button has-text-dark has-text-weight-bold pl-4 pr-4"
                        aria-label="show table"
                        on:mousedown={toggleView}>
                    <span>
                        {#if $visible}
                            { numberRows + ' rows ' + Object.keys(data).length + ' columns'}
                        {:else }
                            <Icon icon="mdi-checkbox-marked-circle-outline" class="m-2 is-size-4 mt-4"/>
                        {/if}
                    </span>
                </button>
                <i slot="hint" class={globStyle.toolTip}>{$visible ? "Open" : "Close"} table view</i>
            </Hint>
            {#if !$visible }
                <Hint>
                    <button id="dec" class="button is-rounded ml-2 mr-2" on:click={dec}
                            transition:fade>
                        <span>▲</span>
                    </button>
                    <i slot="hint" class={globStyle.toolTip}>Page up</i>
                </Hint>
                <Hint>
                    <button id="inc" class="button is-rounded" on:click={inc} transition:fade>
                        <span>▼</span>
                    </button>
                    <i slot="hint" class={globStyle.toolTip}>Page down</i>
                </Hint>

            {/if}
        </div>
        <div class="navbar-item is-pulled-right">
            {#if !$visible }
                <span class="has-text-grey-dark">Page {Math.ceil((page.offset + page.step) / page.step)}</span>
            {/if}
        </div>
        <div class="navbar-end p-2">
            {#if currentEngineState !== Sound.UNMOUNTED}
            <Hint>
                <button id="import" class="button has-text-black-bis  has-text-weight-bold pl-4 pr-4 hover "
                        on:mousedown={handleSonifyClick}
                        on:mouseup={handleSonifyClick}
                >Sonify</button>
                <i slot="hint" class={globStyle.toolTip}>Sonify data set</i>
            </Hint>
            {/if}
        </div>
    </div>
</div>
