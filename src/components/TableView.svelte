<script>
    import { dataSets } from "../stores/dataSetsStore.js";
    import TableHTML from "./TableHTML.svelte";
    import BarChart from "./BarChart.svelte";

</script>

{#if $dataSets.length}
    {#each $dataSets as metadata, index }
        <thead class="tableTitle">{metadata.title.toUpperCase()}</thead>
        <!-- todo: display real graphs -->
        <!--        <BarChart data={metadata.columnsWithHeaders}/>-->
        <img src="/graphics/images/lineChartMultipleSeriesVoroini.png">
        <TableHTML data={metadata.columnsWithHeaders} {index} />
    {/each}
{/if}

<style>
    .tableTitle {
        overflow-x: visible;
        font-size: x-large;
    }
</style>
