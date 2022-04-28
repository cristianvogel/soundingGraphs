<script lang="ts">
	import '../app.scss';
	import Nav from '../components/Nav.svelte';
	import {
		audioEngine,
		audioStore,
		speechSynthesis
	} from "../lib/stores/audioStores";

	import { lazyLoad } from '@benten28/svelte-utilities'
	import {onMount, setContext} from "svelte";
	import {get} from "svelte/store";
	import { ColourMapping } from "../lib/graphics/colourMapping";
	import SoundingGraphs from "../components/GraphicalExtras/SoundingGraphs.svelte";
	import  Elementary from "../lib/audio/audioEngine";

	const colourMapping:ColourMapping = new ColourMapping();
	$: modalClicked = false;

	onMount ( async () => {
		// initialise single audiocontext and store it
		const store1= get(audioStore)
		if (!store1.context) {
			const context:AudioContext = new (window["AudioContext"])()
			audioStore.update(store => ({ ...store, context, contextState: 'suspended' }))
			console.log('Assigned audio context for: '+ context.sampleRate + ' SR ')
			const engine: Elementary = Elementary.instantiateCore(context)
			audioEngine.set( engine )
			await engine.mount()
		}

		// initialise speech
			const speech:SpeechSynthesis = window.speechSynthesis
			speechSynthesis.set(speech)
	})

	setContext( 'colour.mapping', colourMapping)
	function handleModalClick() { modalClicked = true };
</script>

<Nav />
{#if $audioStore.elementaryReady && modalClicked}
<section class="container has-background-grey-light p-6">
	<slot></slot>
</section>
	{:else }
	<div class="modal is-active">
		<div class="modal-background">
			<img use:lazyLoad={'graphics/svg/rainbowWave.svg'} />
		</div>
		<div class="modal-content" style="overflow: visible">
			<button class="box p-6 has-background-black-bis has-text-centered" aria-label="Click now to Start" on:click={handleModalClick} >
				<SoundingGraphs size="1"/>
			</button>
		</div>
	</div>
{/if}

<style>

</style>
