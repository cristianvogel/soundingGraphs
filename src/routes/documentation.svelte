<svelte:head>
    <title>Documentation</title>
</svelte:head>

<!-- preloader -->

<script context="module">
    export async function load() {
        const url = `https://raw.githubusercontent.com/sonifydata/twotone/master/README.md`;
        const res = await fetch(url);
        const post = await res.text();
        return {props: {post}}
    }
</script>

<!-- component -->
<script>
    export let post;
    import { fly } from 'svelte/transition';
    import { marked } from 'marked';
    marked.setOptions({
        renderer: new marked.Renderer(),
        pedantic: false,
        gfm: true,
        breaks: false,
        sanitize: false,  // todo: use a sanitize library like DOMPurify, sanitize-html or insane on the output HTML!
        smartLists: true,
        smartypants: false,
        xhtml: false,
        silent: true
    });

    let showDocs = false;
    function toggleTable() { showDocs = !showDocs }

</script>

    <h1 class="title pt-3">Sonify IO</h1>
    <p>Visit <a href="https://sonify.io">Sonify Website</a> to read the latest updates</p>
        <button class="button is-info m-4" on:click={toggleTable}>Documentation</button>
{#if post && showDocs}

    <div class="content is-medium" transition:fly="{{ y: 100, duration: 1000 }}">
     {@html marked(post) }
    </div>
{/if}

<style>
</style>
