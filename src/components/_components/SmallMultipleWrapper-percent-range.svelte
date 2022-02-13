<script>
    import { LayerCake, ScaledSvg, calcExtents, Html } from 'layercake';
    import SharedTooltip from './SharedTooltip.html.svelte';
    import Labels from './GroupLabels.html.svelte';
    import {interpolateRainbow, interpolateGreys } from "d3-scale-chromatic";
    import Line from './Line.svelte';

    export let data;
    export let fullExtents;
    export let scale;
    export let extentGetters;
    export let normStep = 0;
    export let header;


    const extents = calcExtents(data, extentGetters);

    const colours = {bg: interpolateRainbow(normStep ** 2), fg: '#111' };


</script>

<LayerCake
        ssr={true}
        percentRange={true}
        padding={{ top: 2, right: 6, bottom: 2, left: 6 }}
        x={extentGetters.x}
        y={extentGetters.y}
        {data}
        xDomain={extents.x}
        yDomain={extents.y}
>
    <ScaledSvg>
        <Line
                stroke={colours.bg}
        />
    </ScaledSvg>
    <Html>
    <Labels header = {header}/>
    <SharedTooltip
            dataset={data}
            {header}
            {colours}
    />
    </Html>
</LayerCake>

