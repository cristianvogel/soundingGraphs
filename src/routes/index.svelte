<!-- main app UI -->
<svelte:head>
    <title>Sounding Graphs (🚨 Work In Progress)</title>
</svelte:head>
<script>
    import TrackOverview from "../components/DataSetOverview/Overview.svelte";
    import { audioEngine } from "$lib/stores/audioStores.ts";
    import { store } from "$lib/stateMachinery/engineStateService.ts";
    import { Sound } from "$lib/common/globals.ts";

    $: currentEngineState = $store.state;
    $: sounding = currentEngineState === Sound.PLAYING || false;
    $: engine = audioEngine;

    function handleScrub(e) {
        //console.log( `scrub data value: ${e.detail.value}`)
        $engine.clicks(e.detail.value)
    }

</script>
    <TrackOverview on:smallGraph.scrubbed={handleScrub}/>


