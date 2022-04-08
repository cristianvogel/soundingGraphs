<!-- main app UI -->
<svelte:head>
    <title>Sounding Graphs (🚨 Work In Progress)</title>
</svelte:head>
<script lang="ts">
    import MainOverview from "../components/DataSetOverview/MainOverview.svelte";
    import { audioEngine, audioStore } from "$lib/stores/audioStores.ts";
    import { Writable } from "svelte/store";
    import type Elementary from "../lib/audio/audioEngine";
    import { fsmToggle } from "../lib/stores/fsmStoreNew";

    const simpleSwitch = fsmToggle;
    $: sounding = ($simpleSwitch === 'on');
    let engine:Writable<Elementary>
    $: engine = audioEngine;

    function handleScrub(e) {
        if (!sounding) return;
        $engine.scrubGraphSonification(e.detail.value, e.detail.label)
    }

</script>
{#if $audioStore.elementaryReady }
    <MainOverview on:smallGraph.scrubbed={handleScrub}/>
{/if}
