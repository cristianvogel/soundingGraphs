
<script>
    import SmallGraphInstance from './SmallGraphInstance.svelte';
    import {mapDataToXYPoints, columnCount } from "$lib/DataUtils.js";
    import {onMount} from "svelte";
    import {from, op} from 'arquero';
    import {calcExtents, flatten} from "layercake";
    import { selectedGraphs } from "$lib/stores/selectedGraphsStore.js";

    export let data = {};  // dataset shaped as columns with keys: headers values: column-data
    export let source = 'unknown'
    export let tableTitle = 'Data'

    let pointSeries = [];
    let fullExtents = [];

    const containerHeight = Math.min( 18 * (columnCount(data)+1), 1000); // hand tuned for layout
    const smallMultipleHeight = Math.max( 50, containerHeight/20); // prob better to compute...


    onMount( () =>
        {
            // on mount, transform the headers and column data shape to a generic XY for plotting overviews
            pointSeries = mapDataToXYPoints(data);
            // -----LayerCake example code------
            // Grab the extents of the full dataset
            // { x: [ min, max ] y: [ min, max ] ... }
            // Array needs to be FLAT() for this to work
            //-----------------------------
            fullExtents = calcExtents( flatten(pointSeries), extentGetters)
        }
    )

    function handleSmallGraphClicked ( e ) {
        const { label, colour, tableTitle} = e.detail
        const entry = { label, colour, tableTitle }
        const prop = op.includes(from($selectedGraphs).array('label'), label, 0)

        if (prop) {
            $selectedGraphs = [...selectedGraphs.prune( entry )]
            console.log('remove from basket: '+ entry)
        } else {
            $selectedGraphs = [ ...$selectedGraphs, entry ]
            console.log('add to basket' + entry)
        }
    }

    const extentGetters = {'x': d => d.x , 'y': d => d.y }
    const headers = op.keys(data)

</script>

<div  class="group-container" style="height: {containerHeight + 18}px">
    {#if pointSeries}
        {#each pointSeries as data, step}
            {@const normStep = (step - 1) / (pointSeries.length - 1) }
            {@const header = (headers[step]) }
            <div class="chart-container mt-3"
                 style="height: {smallMultipleHeight}px; cursor: pointer;">
                <SmallGraphInstance
                        {extentGetters}
                        {data}
                        {fullExtents}
                        {normStep}
                        {header}
                        {step}
                        on:smallGraph.clicked={handleSmallGraphClicked}
                        {tableTitle}
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
    {/if}
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
