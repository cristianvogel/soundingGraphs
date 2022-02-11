<script>
    import * as Plot from "@observablehq/plot";
    import {onMount} from "svelte";

    export let data
    let graphPlot

    onMount( () => {
     //read svg
        const sales = [
            {units: 10, fruit: "fig"},
            {units: 20, fruit: "date"},
            {units: 40, fruit: "plum"},
            {units: 30, fruit: "plum"}
        ]
        graphPlot = (Plot.dot(sales, {x: "units", y: "fruit"}).plot())


    })

</script>

<object type="image/svg+xml" data={graphPlot}></object>
