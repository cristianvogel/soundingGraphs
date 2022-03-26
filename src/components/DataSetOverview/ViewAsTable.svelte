<script lang="ts">
    import { slide , fly } from 'svelte/transition';
    import { rowCount, normalizeText} from "../../lib/common/dataUtils.js";
    import TableBody from "./TableBody.svelte";
    import DataSetFooter from "./DataSetFooter.svelte";
    import { get } from 'svelte/store'
    import { getContext, setContext } from "svelte";
    import { tableViewState } from "$lib/stores/graphsViewStores";

    const tints = getContext('colour.mapping')
    const tint = ( n ) => tints.bgDarker( n )

    export let data = {}
    export let index = 0;
    const size = Object.keys(data).length || 1;

    const numberRows = rowCount(data);
    const visible = tableViewState();

    let offset = 0, step = 10, direction = 1

    const inc = () => {
        if ((offset + step) >= (numberRows - step)) {
            offset = numberRows - step
        } else {
            offset = offset + step
        }
        direction = 1;
    }

    const dec = () => {
        if ((offset - step) < 0) {
            offset = 0
        } else {
            offset = offset - step
        }
        direction = 0;
    }

    setContext( 'table.jump', { inc, dec } )
    setContext('table.status', {
        toggleView: () => visible.set(!get(visible)),
        visible: visible
    });



</script>

{#if !$visible}
    <div class="table-container is-centered">
    <table class="table is-striped is-narrow" out:slide style="background-color: transparent">
        {#each (Object.keys(data)) as title, i}
            {@const normSpread = (i-1) / ( size - 1) }
            <th>
                <abbr class="has-text-white-ter is-size-6 p-1" {title} >
                  <span style="background-color: { tint(normSpread) }">{normalizeText(title)}</span>
                </abbr>
            </th>
        {/each}
        {#key offset}
            <tbody id={'table'+index} in:fly={{ y: ( direction ? 50 : -50)  }}>
                     <TableBody {data} page="{{step, offset}}" />
            </tbody>
        {/key}
    </table>
    </div>
{/if}
<div class="mt-4">
    <DataSetFooter {data} page="{{step, offset}}"/>
</div>

<style>
    #import:hover {
        background-color: #32c1b5;
    }
</style>
