<script>

    import { table } from "../js/modules/arquero-master/src" ;
    import { formatDate, formatTime } from "../js/dateUtils.js";
    import Hint from "svelte-hint";
    import { globStyle } from '../assets/styleDefs.js'
    import { slide, fade , fly } from 'svelte/transition';

    export let data, index;
    const pageStep = 10;
    let tableOffset = 0;
    const rowCount = table( data ).numRows();
    let hide = true;
    let incr = true;

    function handlePaginationInc( ) {
        if ((tableOffset + pageStep) >= (rowCount - pageStep) ) { tableOffset = rowCount - pageStep}
        else { tableOffset += pageStep }
        incr = true;
    }

    function handlePaginationDec( ) {
        if ((tableOffset - pageStep) < 0){ tableOffset = 0 }
        else { tableOffset -= pageStep; }
        incr = false;
    }

    function toggleShowHide(){
        hide = !hide;
    }

</script>
{#if !hide}
    <div class="content is-centered">
<table class="table" out:slide style="background-color: transparent">
    {#each (Object.keys(data)) as title, i}
        <th >
            <abbr class="has-background-success has-text-white-ter is-size-6 p-1" {title} >
                {title.trim()}
            </abbr>
        </th>
    {/each}
    {#key tableOffset}
    <tbody id={'table'+index} in:fly={{ y: ( incr ? 50 : -50)  }}>

    {@html
        table(data)
            .toHTML({
                style: {
                    td: "font-size: smaller;",
                    th: "visibility: hidden; display: none",
                },
                class: { tr: "has-background-white-bis", td: "p-1 has-text-justified"},
                classAlt: {tr:"has-background-light" },
                limit: pageStep,
                format: {
                    Time: (d)=> formatTime(d),
                    Date: (d)=> formatDate(d)
                },
                offset: tableOffset
            })
    }

    </tbody>
    {/key}
</table>
    </div>
{/if}
<div class="box" >
    <div class="navbar" >
            <div class="navbar-start p-2">
                <Hint>
                    <button class="button has-background-success has-text-white-ter has-text-weight-bold pl-4 pr-4"
                            aria-label="show table"
                            on:click={toggleShowHide}>
                        <span>{hide ? "Show " : "Hide "} {rowCount} rows {Object.keys(data).length} columns</span>
                    </button>
                    <i slot="hint" class={globStyle.toolTip}>{hide ? "Open" : "Close"} table view</i>
                </Hint>
                {#if !hide}
                    <Hint>
                        <button id="dec" class="button is-rounded ml-2 mr-2" on:click={handlePaginationDec}
                                transition:fade>
                        <p>▲</p>
                        </button>
                        <i slot="hint" class={globStyle.toolTip}>Page up 10 entries</i>
                    </Hint>
                    <Hint>
                        <button id="inc" class="button is-rounded" on:click={handlePaginationInc} transition:fade>
                           <p>▼</p>
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



<style>
    #import:hover {
        background-color: #32c1b5;
    }
</style>
