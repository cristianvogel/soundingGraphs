<!--
  @component
  Generates a tooltip that works on multiseries datasets, like multiline charts. It creates a tooltip showing the name of the series and the current value. It finds the nearest data point using the [GraphInteraction.html.svelte](https://layercake.graphics/components/QuadTree.html.svelte) component.
 -->
<script>
    import { createEventDispatcher, getContext } from "svelte";
    import { format } from 'd3-format';
    import GraphQuadTreeSearch from './QuadTree.svelte';
    import OvalMark from "../GraphicalExtras/OvalMark.svelte";
    import { fade } from "svelte/transition";
    import { soundToggle } from "$lib/stores/fsmStoreNew.ts";
    import { GraphScrubKeys } from "$lib/common/globals.ts";
    import Speaker from "../GraphicalExtras/Speaker.svelte";
    import Icon from "@iconify/svelte";
    import { roundTo } from "@thi.ng/math";

    const { data, width, yScale, config } = getContext('LayerCake')

    const simpleSwitch = soundToggle;
    $: sounding = ($simpleSwitch === 'on');

    export let header;
    export let tint = '#111';

    const commas = format(',');
    const titleCase = d => d.replace(/^\w/, w => w.toUpperCase());

    /** @type {Function} [formatTitle=d => d] - A function to format the tooltip title, which is `$config.x`. */
    export let formatTitle = d => d;

    /** @type {Function} [formatValue=d => isNaN(+d) ? d : commas(d)] - A function to format the value. */
    export let formatValueWithCommas = d => isNaN(+d) ? d : commas(d);

    export let formatValue = d => isNaN(+d) ? d : roundTo(d, 0.01).toPrecision(4);

    /** @type {Function} [formatKey=d => titleCase(d)] - A function to format the series name. */
    export let formatKey = d => titleCase(d);

    /** @type {Number} [offset=-20] - A y-offset from the hover point, in pixels. */
    export let offset = -20;

    /** @type {Array} [dataset] - The dataset to work off of—defaults to $data if left unset. You can pass something custom in here in case you don't want to use the main data or it's in a strange format. */
    export let dataset = [] ;
    export let tableTitle = 'data';

    const w = 240;
    const w2 = w / 2;

    /* --------------------------------------------
     *
     */
    function sortResult(result) {
        if (Object.keys(result).length === 0) return [];
        const rows = Object.keys(result).filter(d => d !== $config.x).map(key => {
            return {
                key: GraphScrubKeys[ (key === 'x') ? 'ROW' : 'POINT' ],
                value: result[key]
            };
        });
        return rows;
    }

    const dispatch = createEventDispatcher();

    function emitScrubData(value) {
        dispatch('smallGraph.scrubbed', {
            label: header,
            colour: tint,
            tableTitle: tableTitle,
            value: value
        });
    }

</script>

<GraphQuadTreeSearch
        on:smallGraph.clicked
        dataset={dataset || $data}
        {header}
        {tableTitle}
        {tint}
        y='x'
        let:x
        let:y
        let:visible
        let:found
        let:e
>
    {@const foundSorted = sortResult(found)}
    {#if visible === true }
        <div in:fade="{{ duration: 50 }}" out:fade="{{ delay: 20, duration: 200}}"
             class="tooltip"
             style="    width:{w}px;
                        top:{offset}px;
                        left:{Math.min(Math.max(w2, x), $width - w2)}px;
                    "
        >
            <div class="has-text-left has-text-black-bis has-text-weight-semibold is-size-6">
                {formatTitle(header)}</div>
            {#each foundSorted as row}
                {@const
                   emitAndRead = ()=>{
                    if (row.key === GraphScrubKeys.POINT) emitScrubData(row.value);
                    return (row.key) }
                }
                <div class="row">
                    <span class="key">{formatKey(emitAndRead())}∙</span>
                        {#if (sounding && (row.key === GraphScrubKeys.POINT))}
                            <span >
                                <Icon icon="mdi:volume-source"
                                      height="2em"
                                      inline="true"
                                      hFlip="false"
                                      class="is-pulled-right"
                                      style="transform: translateY(15%)">
                                </Icon>
                            </span>
                        {/if}
                    <span class={(row.key === GraphScrubKeys.POINT) ? 'is-size-4': ''}>
                        {formatValue(row.value)}
                    </span>

                </div>
            {/each}
            <nav class="level">
                <OvalMark {tint} _class="level-left"/>
                <div class="subtitle level-right is-pulled-right">click to select</div>️
            </nav>
        </div>
    {/if}
</GraphQuadTreeSearch>

<style>
    .circleMark {
        border-bottom:3em solid;
        border-radius: 1.5em;
        border-right:3em solid transparent;
    }

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
