<!--
  @component
  Generates a tooltip that works on multiseries datasets, like multiline charts. It creates a tooltip showing the name of the series and the current value. It finds the nearest data point using the [QuadTree.html.svelte](https://layercake.graphics/components/QuadTree.html.svelte) component.
 -->
<script>
    import { getContext } from 'svelte';
    import { fade } from "svelte/transition";
    import { format } from 'd3-format';
    import QuadTree from './QuadTree.html.svelte';
    const { data, width, yScale, config } = getContext('LayerCake')

    export let header;
    export let tint = '#111';

    const commas = format(',');
    const titleCase = d => d.replace(/^\w/, w => w.toUpperCase());

    /** @type {Function} [formatTitle=d => d] - A function to format the tooltip title, which is `$config.x`. */
    export let formatTitle = d => d;

    /** @type {Function} [formatValue=d => isNaN(+d) ? d : commas(d)] - A function to format the value. */
    export let formatValue = d => isNaN(+d) ? d : commas(d);

    /** @type {Function} [formatKey=d => titleCase(d)] - A function to format the series name. */
    export let formatKey = d => titleCase(d);

    /** @type {Number} [offset=-20] - A y-offset from the hover point, in pixels. */
    export let offset = -20;

    /** @type {Array} [dataset] - The dataset to work off of—defaults to $data if left unset. You can pass something custom in here in case you don't want to use the main data or it's in a strange format. */
    export let dataset ;

    const w = 240;
    const w2 = w / 2;

    /* --------------------------------------------
     * Sort the keys by the highest value
     */
    function sortResult(result) {
        if (Object.keys(result).length === 0) return [];
        const rows = Object.keys(result).filter(d => d !== $config.x).map(key => {
            return {
                key,
                value: result[key]
            };
        }).sort((a, b) => b.value - a.value);
        return rows;
    }

</script>

<style>
    .tooltip {
        position: absolute;
        font-size: 13px;
        pointer-events: none;
        border: 1px solid #ccc;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.85);
        transform: translate(-25%, -100%);
        padding: 5px;
        /*pointer-events: none;*/
        z-index: 100;
    }

    .key {
        color: #999;
    }
</style>

<QuadTree
        on:smallGraph.clicked
        dataset={dataset || $data}
        {header}
        y='x'
        let:x
        let:y
        let:visible
        let:found
        let:e
>

    {@const foundSorted = sortResult(found)}
    {#if visible === true }
        <div transition:fade
             class="tooltip"
             style="    width:{w}px;
                        top:{offset}px;
                        left:{Math.min(Math.max(w2, x), $width - w2)}px;
                    "
        >
            <span class="is-size-3"
                  style="color: {tint}">◉️</span>
            <span class="has-text-left has-text-black-bis has-text-weight-semibold is-size-6">
                {formatTitle(header)}</span>
            {#each foundSorted as row}
                <div class="row"><span class="key">{formatKey(row.key)}∙</span> {formatValue(row.value)}</div>
            {/each}
        </div>
    {/if}
</QuadTree>
