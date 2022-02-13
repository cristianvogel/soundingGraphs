<!--
  @component
  Generates a tooltip that works on multiseries datasets, like multiline charts. It creates a tooltip showing the name of the series and the current value. It finds the nearest data point using the [QuadTree.html.svelte](https://layercake.graphics/components/QuadTree.html.svelte) component.
 -->
<script>
    import { getContext } from 'svelte';
    import { format } from 'd3-format';

    import QuadTree from './QuadTree.html.svelte';

    const { data, width, yScale, config } = getContext('LayerCake');
    /** @type {String} header label text
     *
     */
    export let header;

    /** @type {Colour} colour tint
     *
     */
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
    export let dataset = undefined;
    export let colours = { bg: 'black' , fg: 'white' };

    const w = 180;
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
        transform: translate(-50%, -100%);
        padding: 5px;
        z-index: 1500;
        pointer-events: none;
    }
    /*.line {*/
    /*    position: absolute;*/
    /*    top: 0;*/
    /*    bottom: 0;*/
    /*    width: 1px;*/
    /*    border-left: 1px dotted #333;*/
    /*    pointer-events: none;*/
    /*}*/
    .tooltip,
    .line {
        transition: left 250ms ease-out, top 250ms ease-out;
    }
    .title {
        font-weight: bold;
        font-size: medium;
    }
    .key {
        color: #999;
    }
</style>

<QuadTree
        dataset={dataset || $data}
        y='x'
        let:x
        let:y
        let:visible
        let:found
        let:e
>
    {@const foundSorted = sortResult(found)}
    {#if visible === true}
        <div
                style="left:{x}px;"
                class="line"></div>
        <div
                class="tooltip"
                style="
                        width:{w}px;
                        display: { visible ? 'block' : 'none' };
                        top:{$yScale(foundSorted[0].value) + offset}px;
                        left:{Math.min(Math.max(w2, x), $width - w2)}px;
                    "
        >
            <span class="is-size-3" style="color: {colours.bg}">◉️</span><abbr class="has-text-weight-semibold is-size-7" style="color: {colours.fg}" >{formatTitle(header)}</abbr>
            {#each foundSorted as row}
                <div class="row"><span class="key">{formatKey(row.key)}∙</span> {formatValue(row.value)}</div>
            {/each}
        </div>
    {/if}
</QuadTree>
