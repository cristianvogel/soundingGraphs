<script>
    // https://layercake.graphics/guide

    import {LayerCake, ScaledSvg, Html, flatten} from 'layercake';
    import InteractiveInfoBox from './InteractiveInfoBox.html.svelte';
    import Labels from './GroupLabels.html.svelte';
    import Line from './Line.svelte';
    import { getContext } from "svelte";

    export let data;
    export let fullExtents;
    export let extentGetters;
    export let normStep = 0;
    export let header;
    export let step;
    export let tableTitle;

    const tints = getContext('colour.mapping')
    let highlight = false;

    function handleSmallGraphClicked( e ) {
        highlight = e.detail.selected
    }
</script>

<LayerCake
        ssr={true}
        percentRange={false}
        padding={{ top: 2, right: 2, bottom: 2, left: 2 }}
        x={extentGetters.x}
        y={extentGetters.y}
        {data}
        flatData = {flatten(data)}
        xDomain = {fullExtents}
        yDomain ={fullExtents}
        pointerEvents = true
>
    <Labels {header} {highlight} {normStep}  />
    <ScaledSvg viewBox='0 0 100 100'>
         <Line stroke={ tints[highlight ? 'bgDarker' : 'bg']( normStep )} {highlight}/>
    </ScaledSvg>

    <Html>
    <InteractiveInfoBox
            dataset={data}
            {header}
            {tableTitle}
            tint = {tints.bg(normStep)}
            on:smallGraph.clicked={handleSmallGraphClicked}
    />
    </Html>
</LayerCake>
