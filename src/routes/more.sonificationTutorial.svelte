<svelte:head>
    <title>Data as Raw Material</title>
</svelte:head>

<!-- preloader -->

<script context="module">
    export async function load() {
        const url =`static/text/local-md/TutorialMapping.md`;
        const res = await fetch(url);
        const post = await res.text();
        return {props: {post}}
    }
</script>

<!--component-->
<script>
    export let post;
    import { perlinNoiseArray } from "../script/perlinNoiseArray.js";
    import {interpolateInferno} from "d3-scale-chromatic";
    import fileIO from "$lib/common/fileIO.ts";
    import Icon from '@iconify/svelte';
    import { fly, slide, fade } from 'svelte/transition';
    import {marked} from "marked";
        marked.setOptions({
        renderer: new marked.Renderer(),
        pedantic: false,
        gfm: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: false
    });

    let showTable = false,
        seed = Date.now(),
        rowLength =15;

    $:noisyArray = (x = seed) =>  perlinNoiseArray( {size: (30*8), step: 0.125, initialOffset: x} );

    function toggleTable() {
        showTable = true;
        seed = Date.now();
    }

    function handleExport( data = { empty: '' }, format = 'json' ){
        fileIO.saveBlob( data, format);
    }

</script>


<div class="content is-medium" transition:fly={{ y: 100, duration: 1000 }}>
    {@html marked(post || `## An error occurred. Please try refreshing the page.`) }
</div>

<nav class="buttons" role="button" aria-label="actions" transition:fade={{ delay: 500}}>
    <div class="navbar-start">
        <div class="navbar-item">
            <button class="button is-primary has-text-white-bis has-text-weight-semibold mb-4" on:click={toggleTable}>Generate</button>
        </div>
    </div>
    <div class="navbar-end">
        <div class="navbar-item">
              <button disabled={!showTable} class="button is-link mb-4" on:click={handleExport(noisyArray(seed))} >
                 <Icon icon="mdi-download" class="is-size-4"></Icon>Download</button>
        </div>
    </div>
</nav>
{#if showTable}
    <div class="table-container" >
        <table class="table is-narrow" out:slide>
            <tbody>
            {#each noisyArray(seed) as val, i}
                {#if (i%rowLength===0)}<tr>{/if}
                    <td
                        in:fly="{{ delay: 5 * i , duration: 3000 * val}}"
                        class="p-2"
                        style:background-color = {interpolateInferno(val)}
                        style:color = hsl(90,100%,{100 - (val * 30)}%)>
                         {val.toFixed(4)}
                     </td>
            {/each}
            </tbody>
        </table>
    </div>
{/if}


<style>
    .active {
        border: solid #ff3e00;
        color: white;
    }
</style>


<!--style:background-color = hsl(100,100%,{colourVar}%)-->
<!--style:color = hsl(100,100%,{100 - colourVar}%)-->
