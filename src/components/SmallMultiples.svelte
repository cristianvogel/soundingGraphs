<script>
    import { calcExtents, flatten } from 'layercake';
    import SmallMultipleWrapper from './SmallMultipleWrapper-percent-range.svelte';
    import {mapDataToXYPoints, rowCount, columnCount} from "../js/dataProcessingUtils.js";
    import {onMount} from "svelte";

    export let data = {};
    let pointSeries = [];
    let containerHeight = 12.5 * (columnCount(data));


    onMount( () =>
        {
            pointSeries = mapDataToXYPoints(data)
        }
    )
    /* --------------------------------------------
     * Grab the extents of the full dataset
     */
    const extentGetters = {
        x: d => d.x,
        y: d => d.y
    };

    const fullExtents = calcExtents(flatten(pointSeries), extentGetters);

    /* --------------------------------------------
     * Sort by the last value
     */
    pointSeries.sort((a, b) => {
        return b[b.length - 1].y - a[a.length - 1].y;
    });

    let scale = 'individual';
</script>

<div class="input-container">
    <label><input class="radio" type="radio" bind:group={scale} value="individual"/>Individual scale</label>
    <label><input class="radio" type="radio" bind:group={scale} value="shared"/>Shared scale</label>
</div>

<div class="group-container" style="height: {containerHeight}px">
    {#if pointSeries}
    {#each pointSeries as data, step}
        {@const normStep = (step - 1) / (pointSeries.length - 1)}
        <div class="chart-container" style="height: {Math.max( 50, containerHeight/20)}px">
            <SmallMultipleWrapper
                    {data}
                    {fullExtents}
                    {scale}
                    {extentGetters}
                    { normStep } }
            />
        </div>
    {/each}
    {/if}
</div>

<style>
    .group-container {
        width: 100%;
        height: 300px;
    }
    .input-container {
        margin-bottom: 7px;
    }
    label {
        cursor: pointer;
    }
    input {
        margin-right: 7px;
    }
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
