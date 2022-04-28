<script context="module">
  export const prerender = false;
</script>

<script>
  // largely based on
  // https://layercake.graphics/example-ssr/SmallMultiples
  import SmallGraphInstance from "./SmallGraphInstance.svelte";
  import { columnCount } from "$lib/common/dataUtils.ts";
  import { from, op } from "arquero";
  import { selectedGraphs } from "$lib/stores/graphsViewStores.ts";

  export let source = "unknown"; // the data attribution source
  export let tableTitle = "";
  export let dataset = {}; // at this point data has been shaped as columns with keys: headers values: column-data
  export let pointSeries = []; //each graph has its data rearranged as 2D points in the store, passed down

  const containerHeight = Math.min(18 * (columnCount(dataset) + 1), 1000); // hand tuned for layout
  const smallMultipleHeight = Math.max(50, containerHeight / 20); // prob better to compute...
  const headers = op.keys(dataset);

  function handleSmallGraphClicked(e) {
    const { label, colour, tableTitle } = e.detail;
    const entry = { label, colour, tableTitle };
    const prop = op.includes(from($selectedGraphs).array("label"), label, 0);

    if (prop) {
      $selectedGraphs = [...selectedGraphs.prune(entry)];
      console.log("remove from basket: " + entry.label);
    } else {
      $selectedGraphs = [...$selectedGraphs, entry];
      console.log("add to basket" + entry.label);
    }
  }
</script>

<div class="group-container" style="height: {containerHeight + 18}px">
  {#each pointSeries as points, step}
    {@const normStep = (step - 1) / (pointSeries.length - 1) }
    {@const header = (headers[step]) }

    <div class="chart-container mt-3"
         style="height: {smallMultipleHeight}px; cursor: pointer;">
      <SmallGraphInstance
        {points}
        {dataset}
        {normStep}
        {header}
        {step}
        on:smallGraph.clicked={handleSmallGraphClicked}
        {tableTitle}
        on:smallGraph.scrubbed
      />
    </div>
  {/each}

  <div class="subtitle p-3 is-size-7"> Source:
    {#if (source === 'unknown' || source === undefined) }
      <span aria-label="unknown data source">unknown</span>
    {:else }
      {@html "<a aria-label='link to data source' href=" + source + ">link</a>" }
    {/if}
  </div>

</div>

<style>
    .chart-container {
        position: relative;
        display: inline-block;
        padding: 5px;
        width: 20%;
        height: 80px;
    }
</style>
