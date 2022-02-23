<script>
    import { dataSets } from "$lib/stores/dataSetsStore.js";
    import ViewAsTable from "./ViewAsTable.svelte";
    import SmallMultiples from "../SmallGraphView/SmallMultiples.svelte";


</script>

{#if $dataSets.length}
    {#each $dataSets as metadata, index }
        <thead class="tableTitle">{metadata.title}</thead>
        <SmallMultiples data={metadata.columnsWithHeaders} source={metadata.source} />
        <ViewAsTable data={metadata.columnsWithHeaders} {index} />
    {/each}
{/if}

<style>
    .tableTitle {
        overflow-x: visible;
        font-size: x-large;
    }
</style>


