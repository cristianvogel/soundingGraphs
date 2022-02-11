<!--todo: generate a cool visual overview of a chart-->

<script>
    import BarChart from "./BarChart.svelte";
    export let data
    let col = 1
</script>

    <BarChart data={data} {col} />
