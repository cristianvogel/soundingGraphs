<script>
    import { dataSets } from "$lib/stores/dataSetsStore.js";
    import ViewAsTable from "./ViewAsTable.svelte";
    import SmallGraphs from "../SmallGraphView/SmallGraphs.svelte";


</script>

{#if $dataSets.length}
    {#each $dataSets as metadata, index }
        <thead class="tableTitle">{metadata.title}</thead>
        <SmallGraphs data={metadata.columnsWithHeaders} source={metadata.source} tableTitle={metadata.title}/>
        <ViewAsTable data={metadata.columnsWithHeaders} {index} />
    {/each}
{/if}

<style>
    .tableTitle {
        overflow-x: visible;
        font-size: x-large;
    }
</style>


