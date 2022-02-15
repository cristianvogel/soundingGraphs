<script>
    import { slide , fly } from 'svelte/transition';
    import {normalizeText, rowCount} from "../../js/dataProcessingUtils.js";
    import TableBody from "./TableBody.svelte";
    import DataSetFooter from "./DataSetFooter.svelte";
    import {setContext} from 'svelte';

    export let data = {}
    export let index = 0;
    const numberRows = rowCount(data);

    $: hidden = true;
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

    setContext( 'jump', {inc, dec} )
    setContext('tableState', {
        toggleView: () => hidden = !hidden
    } );


</script>
{#if !hidden}
    <div class="table-container is-centered">
    <table class="table is-striped is-narrow" out:slide style="background-color: transparent">
        {#each (Object.keys(data)) as title, i}
            <th>
                <abbr class="has-background-success has-text-white-ter is-size-6 p-1" {title} >
                    {normalizeText(title)}
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
    <DataSetFooter {data} {hidden}/>
</div>

<style>
    #import:hover {
        background-color: #32c1b5;
    }
</style>
