<script>
// not working yet

    import * as Plot from "@observablehq/plot";
    import * as arquero from '../js/modules/arquero-master/src'


    export let data = {}, col = 0

    // const dataTable = arquero.table(data).objects( {columns: [0,1]} );
    const sales = [
        {units: 10, fruit: "fig"},
        {units: 20, fruit: "date"},
        {units: 40, fruit: "plum"},
        {units: 30, fruit: "plum"}
    ]

    // console.log( dataTable )
    const graphPlot = Plot.dot(sales, {x: 'fruit', fill: 'units', fillOpacity: 0.2}).plot()

</script>

<svg>{ graphPlot }</svg>

