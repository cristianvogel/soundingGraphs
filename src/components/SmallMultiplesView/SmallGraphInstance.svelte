<script>
    // https://layercake.graphics/guide

    import {LayerCake, ScaledSvg, Html, calcExtents, flatten} from 'layercake';
    import InteractiveInfoBox from './InteractiveInfoBox.svelte';
    import Labels from './GroupLabels.html.svelte';
    import Line from './Line.svelte';
    import { getContext } from "svelte";
    export let points = []; // at this point data is 2D points
    export let normStep = 0;
    export let header;
    export let step;
    export let tableTitle;
    export let dataset;

    const tints = getContext('colour.mapping')
    let highlight = false;
    const extentGetters = {'x': d => d.x , 'y': d => d.y };
    let fullExtents = calcExtents( points, extentGetters)
    const flatData = flatten(points)

    function handleSmallGraphClicked( e ) {
        highlight = e.detail.selected
    }

</script>

<LayerCake
        ssr={false}
        percentRange={false}
        padding={{ top: 2, right: 2, bottom: 2, left: 2 }}
        x={extentGetters.x}
        y={extentGetters.y}
        data = {points}
        {flatData}
        xDomain = {fullExtents}
        yDomain ={fullExtents}
>
    <Labels {header} {highlight} {normStep}  />

    <ScaledSvg viewBox='0 0 100 100'>
         <Line stroke={ tints[highlight ? 'bgDarker' : 'bg']( normStep )}
               {highlight}/>
    </ScaledSvg>

    <Html>
    <InteractiveInfoBox
            {dataset}
            {header}
            {tableTitle}
            tint = {tints.bg(normStep)}
            on:smallGraph.clicked={handleSmallGraphClicked}
            on:smallGraph.clicked
            on:smallGraph.scrubbed
    />
    </Html>
</LayerCake>

