<script>
    // component collects and displays a kind of 'Cart'
    // with the data columns selected by the user
    // It involves some slightly tricky data-wrangling to figure out
    // the Parent table of each 'Orphaned' child
    // todo: improve layout when there's a lot of selection, modal maybe?

    import {selectedGraphs} from "$lib/stores/graphsViewStores.ts";
    import {from, op} from 'arquero';
    import {fade} from 'svelte/transition'
    import {TEXT_CHAR_LIMIT} from "$lib/common/globals.ts";
    import Icon from "@iconify/svelte";

    function storeValid(s) {
        typeof (s) === 'undefined'
    }

    $: rt = from($selectedGraphs) // create arquero table from...
    $: labels = storeValid(rt) ? rt.orderby('tableTitle').array('label') : rt.array('label')
    $: tints = storeValid(rt) ? rt.orderby('colour') : rt.array('colour')
    $: tableTitles = rt.array('tableTitle')

</script>
<div class="dropdown is-hoverable">
    <div class="dropdown-trigger">
        <button class="button has-icons-left" style="background-color: transparent;" aria-haspopup="true" aria-label="Basket with selected graphs" aria-controls="dropdown-menu7">
                 <Icon class="m-2 is-size-5" icon="mdi-progress-check" style="color: {tints.at(-1)}"/> Basket
        </button>
    </div>
    {#if $selectedGraphs.length > 0}
        <div class="dropdown-menu" id="dropdown-menu7" role="menu">
            <div class="dropdown-content" transition:fade>
                {#each labels as label, i}
                    {@const titleSR = {
                        "curr": tableTitles.at(Math.max(0, i)),
                        "prev": tableTitles.at(Math.max(0, i - 1))
                    }}
                    <!-- a naive-but-works shift register approach to figure out the parent tables -->
                    {#if (i === 0 || !op.equal(titleSR.prev, titleSR.curr)) }

                        <div id={titleSR} class="subtitle is-size-7 dropdown-item
                                                 has-text-weight-bold
                                                 has-background-primary
                                                 has-text-white-ter
                                                 ml-2 mr-3 mb-0 p-2"
                             style="overflow-wrap: anywhere;">{titleSR.curr}</div>
                    {/if}
                    <div class="level is-size-7 dropdown-item p-1 m-1">
                        <div class="level-item is-justify-content-left">{label.slice(0, TEXT_CHAR_LIMIT) + (label.length > TEXT_CHAR_LIMIT ? '…' : '') }</div>
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


    .dropdown-menu {
        transform: translateX(-10em);
    }
</style>
