<script>
    import { dataSets } from "$lib/stores/dataSetsStore.js";
    import ViewAsTable from "./ViewAsTable.svelte";
    import SmallGraphs from "../SmallMultiplesView/SmallGraphs.svelte";

</script>

{#if $dataSets.length}
    {#each $dataSets as metadata, index }
        <thead class="tableTitle">{metadata.title}</thead>
        <SmallGraphs pointSeries={metadata.pointSeries}
                     dataset={metadata.columnsWithHeaders}
                     source={metadata.source}
                     tableTitle={metadata.title}
                     on:smallGraph.scrubbed
        />
        <ViewAsTable data={metadata.columnsWithHeaders} {index} />
    {/each}
{/if}

<style>
    .tableTitle {
        overflow-x: visible;
        font-size: x-large;
    }
</style>


