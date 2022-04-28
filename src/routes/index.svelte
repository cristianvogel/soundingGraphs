<!-- main app UI -->
<svelte:head>
    <title>Sounding Graphs by Cristian Vogel (🚨 Work In Progress)</title>
</svelte:head>
<script lang="ts">
    import MainOverview from "../components/DataSetOverview/MainOverview.svelte";
    import { audioEngine } from "$lib/stores/audioStores.ts";
    import { Writable } from "svelte/store";
    import type Elementary from "../lib/audio/audioEngine";
    import { soundToggle } from "../lib/stores/fsmStoreNew";

    const simpleSwitch = soundToggle;
    $: sounding = ($simpleSwitch === 'on');
    let engine:Writable<Elementary>
    $: engine = audioEngine;

    function handleScrub(e) {
        if (!sounding) return;
        $engine.scrubGraphSonification(e.detail.value, e.detail.label)
    }
</script>

    <MainOverview on:smallGraph.scrubbed={handleScrub}/>

