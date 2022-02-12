<!--
	@component
	Generates an SVG area shape using the `area` function from [d3-shape](https://github.com/d3/d3-shape).
 -->
<script>
    import { getContext } from 'svelte';

    const { data, xGet, yGet } = getContext('LayerCake');

    export let stroke = '#111';
    let xy={x:0, y:0}
    $: path = 'M' + $data
        .map( (d, i) => {

           if (!( $xGet(d) ) || !($yGet(d))) { return ('x') }; // skip non-numeric
            xy = { x: $xGet(d), y: $yGet(d) };
            return (xy.x + ' ' + xy.y + ' ');
        })
        .join('L');
    // courtesy of regex101.com 🙏🏽
    // will strip non-numeric placeholder from path defining string
    const regex = /(xL)/gm;
    const subst = '';

</script>
    <path class='path-line' d='{path.replace(regex, subst)}' {stroke}></path>
<style>
    .path-line {
        fill: none;
        stroke-linejoin: round;
        stroke-linecap: round;
        stroke-width: 0.15em;
    }
</style>


