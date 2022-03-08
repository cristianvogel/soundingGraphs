<script>
    // component collects and displays a kind of 'Cart'
    // with the data columns selected by the user
    // It involves some slightly tricky data-wrangling to figure out
    // the Parent table of each 'Orphaned' child
    // todo: improve layout when there's a lot of selection, modal maybe?

    import {selectedGraphs} from "$lib/stores/selectedGraphsStore.js";
    import {from, op} from 'arquero';
    import {fade} from 'svelte/transition'
    import {TRIM} from "$lib/Globals.js";
    import Icon from "@iconify/svelte";
    const rainbow = import( '../../../static/graphics/svg/rainbowWave.svg' )
    function storeValid(s) {
        typeof (s) === 'undefined'
    }

    $: rt = from($selectedGraphs)
    $: labels = storeValid(rt) ? rt.orderby('tableTitle').array('label') : rt.array('label')
    $: tints = storeValid(rt) ? rt.orderby('colour') : rt.array('colour')
    $: tableTitles = rt.array('tableTitle')

</script>
<div class="dropdown is-hoverable">
    <div class="dropdown-trigger">
        <button class="button has-icons-right" style="background-color: transparent;" aria-haspopup="true" aria-controls="dropdown-menu7">
           <span class="rainbow-text has-text-weight-bold is-size-4">SOUNDING GRAPHS</span> <i class="ml-2 mt-2 is-size-4"><Icon icon="mdi-progress-check" /></i>
        </button>
    </div>
    {#if $selectedGraphs.length > 0}
        <div class="dropdown-menu" id="dropdown-menu7" role="menu">
            <div class="dropdown-content" transition:fade>
                {#each labels as label, i}
                    {@const titleSR = {
                        "curr": tableTitles.at(Math.max(0, i)),
                        "prev": tableTitles.at(Math.max(0, i - 1))
                    }}<!-- a naive-but-works shift register approach to figure out the parent tables -->
                    {#if (i === 0 || !op.equal(titleSR.prev, titleSR.curr)) }

                        <div id={titleSR} class="subtitle is-size-7 dropdown-item
                                                 has-text-weight-bold
                                                 has-background-primary
                                                 has-text-white-ter
                                                 ml-2 mr-3 mb-0 p-2"
                             style="overflow-wrap: anywhere;">{titleSR.curr}</div>
                    {/if}
                    <div class="level is-size-7 dropdown-item p-1 m-1">
                        <div class="level-item is-justify-content-left">{label.slice(0, TRIM) + (label.length > TRIM ? '…' : '') }</div>
                        <div class="level-item is-justify-content-right" style="color: {tints.at(i)}">
                            ◉
                        </div>
                    </div>
                    <div class="dropdown-divider mt-1 mb-1"></div>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>

    .rainbow-text {
        background-image: linear-gradient(90deg,#80ed12,#A5D604,#C7B601,#E39209,#F66C1C,#FE4838,#FB295B,#ED1180,#D504A6,#B601C8,#910AE3,#6B1DF6,#4739FE,#285BFB,#1181ED,#03A6D5);
        color: #0000;
        -webkit-background-clip: text;
        background-clip: text;
    }

</style>
