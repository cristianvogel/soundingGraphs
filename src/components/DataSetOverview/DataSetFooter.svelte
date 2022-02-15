<script>
    import Hint from "svelte-hint";
    import { globStyle } from '../../assets/styleDefs.js'
    import {  fade  } from 'svelte/transition';
    import { rowCount } from "../../js/dataProcessingUtils.js";
    import {getContext} from "svelte";

    export let data = {}
    export let hidden = true;

    const toggleView = getContext('tableState').toggleView
    const inc = getContext('jump').inc
    const dec = getContext('jump').dec
    const numberRows = rowCount(data);

</script>

<div class="box">
    <div class="navbar" >
        <div class="navbar-start p-2">
            <Hint>
                <button class="button has-background-success has-text-white-ter has-text-weight-bold pl-4 pr-4"
                        aria-label="show table"
                        on:click={toggleView}>
                    <span >{hidden ? "Show " : "Hide "} {numberRows} rows {Object.keys(data).length} columns</span>
                </button>
                <i slot="hint" class={globStyle.toolTip}>{hidden ? "Open" : "Close"} table view</i>
            </Hint>
            {#if !hidden}
                <Hint>
                    <button id="dec" class="button is-rounded ml-2 mr-2" on:click={dec}
                            transition:fade>
                        <span>▲</span>
                    </button>
                    <i slot="hint" class={globStyle.toolTip}>Page up 10 entries</i>
                </Hint>
                <Hint>
                    <button id="inc" class="button is-rounded" on:click={inc} transition:fade>
                        <span>▼</span>
                    </button>
                    <i slot="hint" class={globStyle.toolTip}>Page down 10 entries</i>
                </Hint>
            {/if}
        </div>
        <div class="navbar-item">
            <!-- todo: display table metadata, source etc -->
        </div>
        <div class="navbar-end p-2">
            <Hint>
                <button id="import" class="button has-text-black-bis  has-text-weight-bold pl-4 pr-4 hover ">Sonify</button>
                <i slot="hint" class={globStyle.toolTip}>Sonify data set</i>
            </Hint>
        </div>
    </div>
</div>
