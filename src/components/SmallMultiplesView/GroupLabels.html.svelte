<!--
  @component
  Generates HTML text labels for a nested data structure. It places the label near the y-value of the highest x-valued data point.
  This is useful for labeling the final point in a multi-series line chart, for example.
  It expects your data to be an array of objects where each has `values` field that is an array of data objects.
  It uses the `z` field accessor to pull the text label.
 -->
<script>
    import { getContext } from 'svelte';
    import { op } from 'arquero';
    import { TEXT_CHAR_LIMIT } from '$lib/common/globals.ts'

    const { data, x, y, xScale, yScale, xRange, yRange, z } = getContext('LayerCake');

    export let header = '';
    export let highlight =  false;
    export let normStep = 0;

    const tints = getContext('colour.mapping')
    const labelColours = { bg: tints.bgDarker(normStep , 2), fg: tints.bgBrighter(normStep, 3 ) }

    header = header.slice(0, TEXT_CHAR_LIMIT) + ( header.length > TEXT_CHAR_LIMIT ? '…' : '' )
    /* --------------------------------------------
     * Title case the first letter
     */
    const cap = val => val.replace(/^\w/, d => d.toUpperCase());

    /* --------------------------------------------
     * Put the label on the highest value
     */
    $: left = values => $xScale(op.greatest(values)) /  Math.max(...$xRange);
    $: top = values => $yScale(op.greatest(values)) / Math.max(...$yRange);
</script>
<div class="level">
{#each $data as group}
        <div
                class="label level-left"
                style="
                      top:{top(group.values) * 100}%;
                      left:{left(group.values) * 100}%;
                      background-color: {highlight ? labelColours.bg : 'transparent'};
                      color:  {highlight ? labelColours.fg : 'grey'};
                      font-weight: {highlight ? 'bolder' : 'normal'}
                    "
        >{header || '' }</div>

        {/each}
        </div>
<style>
    .label {
        position: absolute;
        transform: translate(0, -100%)translateY(1px);
        font-size: 12px;
    }

</style>
