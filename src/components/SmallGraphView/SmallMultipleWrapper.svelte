<script>
    import {LayerCake, ScaledSvg, Html, flatten} from 'layercake';
    import SharedTooltip from './SharedTooltip.html.svelte';
    import Labels from './GroupLabels.html.svelte';
    import {interpolateRainbow} from "d3-scale-chromatic";
    import Line from './Line.svelte';
    import {getContext} from "svelte";
    import {get} from "svelte/store";

    export let data;
    export let fullExtents;
    export let extentGetters;
    export let normStep = 0;
    export let header;
    export let step;
    const colours = getContext('colour.mapping')()
    let tints = get(colours)
    const tint = ( n ) => tints.bg( n )

</script>

<LayerCake
        ssr={true}
        percentRange={true}
        padding={{ top: 2, right: 2, bottom: 2, left: 2 }}
        x={extentGetters.x}
        y={extentGetters.y}
        {data}
        flatData = {flatten(data)}
        xDomain = {fullExtents}
        yDomain ={fullExtents}
>
    <ScaledSvg>
        <Line
                stroke={tint(normStep)}
        />
    </ScaledSvg>
    <Html>
    <Labels header = {header}/>
    <SharedTooltip
            dataset={data}
            {header}
            tint = {tint(normStep)}
    />
    </Html>
</LayerCake>

