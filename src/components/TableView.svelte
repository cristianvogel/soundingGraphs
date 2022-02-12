<script>
    import { dataSets } from "../stores/dataSetsStore.js";
    import TableHTML from "./TableHTML.svelte";
    import SmallMultiples from "./SmallMultiples.svelte";

</script>

{#if $dataSets.length}
    {#each $dataSets as metadata, index }
        <thead class="tableTitle">{metadata.title.toUpperCase()}</thead>
        <SmallMultiples data={metadata.columnsWithHeaders} {index} />
        <TableHTML data={metadata.columnsWithHeaders} {index} />
    {/each}
{/if}

<style>
    .tableTitle {
        overflow-x: visible;
        font-size: x-large;
    }
</style>
