<script>
    import {dataSets} from "../lib/stores/dataSetsStore.js";
    import ProjectBox from "../components/ProjectBox.svelte";
</script>

<svelte:head>
    <title>Welcome</title>
</svelte:head>

    <h1 class="title">
        Recent Projects
    </h1>

{#each $dataSets as dataset , index}
    <div class="box columns m-2">
         <ProjectBox {index} {dataset}/>
    </div>
{/each}


<style>

</style>
