<!-- main app UI -->
<svelte:head>
    <title>Sounding Graphs (🚨 Work In Progress)</title>
</svelte:head>
<script lang="ts">
    import MainOverview from "../components/DataSetOverview/MainOverview.svelte";
    import { audioEngine, audioStore } from "$lib/stores/audioStores.ts";
    import { Writable } from "svelte/store";
    import type Elementary from "../lib/audio/audioEngine";
    import { fade, draw, fly } from 'svelte/transition';

    let engine:Writable<Elementary>
    $: engine = audioEngine;

    function handleScrub(e) {
        //console.log( `scrub data value: ${e.detail.value}`)
        $engine.scrubGraphSound(e.detail.value, e.detail.label)
    }

</script>
{#if $audioStore.elementaryReady }
    <MainOverview on:smallGraph.scrubbed={handleScrub}/>
{/if}
