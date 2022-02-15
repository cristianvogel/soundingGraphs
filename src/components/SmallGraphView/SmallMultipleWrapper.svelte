<script>
    import {LayerCake, ScaledSvg, Html, flatten} from 'layercake';
    import SharedTooltip from './SharedTooltip.html.svelte';
    import Labels from './GroupLabels.html.svelte';
    import {interpolateRainbow} from "d3-scale-chromatic";
    import Line from './Line.svelte';

    export let data;
    export let fullExtents;
    export let extentGetters;
    export let normStep = 0;
    export let header;
    export let step;
    const colours = {bg: interpolateRainbow(normStep ** 2), fg: '#111' };
</script>

<LayerCake
        ssr={true}
        percentRange={true}
        padding={{ top: 2, right: 6, bottom: 2, left: 6 }}
        x={extentGetters.x}
        y={extentGetters.y}
        {data}
        flatData = {flatten(data)}
        xDomain = {fullExtents}
        yDomain ={fullExtents}
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

