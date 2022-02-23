<!--
	@component
	Generates an SVG area shape using the `area` function from [d3-shape](https://github.com/d3/d3-shape).
 -->

<script>
    import { getContext } from 'svelte';
    import { op } from 'arquero';

    const { data, xGet, yGet } = getContext('LayerCake');

    export let stroke = '#111';
    export let highlight = false;

    let xy={x:0, y:0}
    let path = 'M' + $data
        .map( (el, i) => {
            let d = {
                    x: op.parse_float(el.x) || '!' ,
                    y: op.parse_float(el.y) || '!'
                }
            if (!( $xGet(d) ) || !($yGet(d))) { return ('!') }; // for skip non-numeric
            xy = { x:($xGet(d)).toFixed(2), y:($yGet(d)).toFixed(2) };
            return (xy.x + ' ' + xy.y + ' ');
        })
        .join('L');
    // courtesy of regex101.com 🙏🏽
    // will validate by removing my non-numeric markers from path defining string
    const regex = /(!L)|(L!)/gm;
    const regex2 = /(!M)|(M!)/gm;
    const subst = '';
    path = path.replace(regex, subst).replace(regex2, 'm 0 0' );

</script>

    <path class="path-line {highlight ? 'selected' : ''}" d='{path}' {stroke}></path>
<style>
    .path-line {
        fill: none;
        stroke-linejoin: round;
        stroke-linecap: round;
        stroke-width: 0.15em;
    }

    .selected {
       /*put selected css styling here*/
    }
</style>


