<!--suppress ALL -->
<script>
    import SmallMultipleWrapper from './SmallMultipleWrapper.svelte';
    import {mapDataToXYPoints, columnCount, normalizeText} from "$lib/DataUtils.js";
    import {onMount} from "svelte";
    import { op } from 'arquero';
    import {calcExtents, flatten} from "layercake";


    export let data = {};  // dataset shaped as columns with keys: headers values: column-data
    export let source = 'unknown';
    let pointSeries = [];
    let fullExtents = [];
    const containerHeight = Math.min( 18 * (columnCount(data)+1), 1000); // hand tuned for layout
    const smallMultipleHeight = Math.max( 50, containerHeight/20); // prob better to compute...

    // on mount, transform the headers and column data shape to a generic XY for plotting overviews
    onMount( () =>
        {

            pointSeries = mapDataToXYPoints(data);
            /* -----LayerCake example code---------------------------------------
              * Grab the extents of the full dataset
              * // { x: [ min, max ] y: [ min, max ] ... }
             */
            // Array needs to be FLAT() for this to work
            fullExtents = calcExtents( flatten(pointSeries), extentGetters)
        }
    )
    const extentGetters = {'x': d => d.x , 'y': d => d.y }
    const headers = op.keys(data)

</script>

<div  class="group-container" style="height: {containerHeight + 18}px">
    {#if pointSeries}
    {#each pointSeries as data, step}
        {@const normStep = (step - 1) / (pointSeries.length - 1)}
        {@const header = normalizeText(headers[step])}
        <div class="chart-container mt-3" style="height: {smallMultipleHeight}px">
            <SmallMultipleWrapper
                    {extentGetters}
                    {data}
                    {fullExtents}
                    {normStep}
                    {header}
                    {step}
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
    /*
        The wrapper div needs to have an explicit width and height in CSS.
        It can also be a flexbox child or CSS grid element.
        The point being it needs dimensions since the <LayerCake> element will
        expand to fill it.
    */
    .chart-container {
        position: relative;
        display: inline-block;
        padding: 5px;
        width: 20%;
        height: 80px;
    }
</style>
