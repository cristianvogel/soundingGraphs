<script>
    import {onDestroy, onMount} from "svelte";
    export let index, dataset;

    onMount(()=>
    {
        /*
            leaving this code here for a while, as reminder of how to pass context in Svelte
         */
            // const ctx = canvas.getContext('2d');
            // if( ctx ) barChart(ctx, metadataObject);
    });

    onDestroy(()=>{
        //clean up
    });


</script>

<div class="column">
    {index} ▶︎ {dataset.title}
    <div>
        <a class="has-text-info-dark" href={dataset.source} target="_blank">source</a>
    </div>
</div>
<div class="column">
<!--    todo: display a cool overview-->
    <figure class="image is-3by1"><img src="/graphics/images/BarsWave.png" style="height: 70%"/></figure>
</div>

<style>

</style>

<!--    <canvas bind:this={canvas} id={'chart'+index} ></canvas>-->
