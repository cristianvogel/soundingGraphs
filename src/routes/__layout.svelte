<script lang="ts">
	import '../app.scss';
	import Nav from '../components/Nav.svelte';
	import {
		audioEngine,
		audioStore,
		speechEngine
	} from "../lib/stores/audioStores";
	import {onMount, setContext} from "svelte";
	import {get} from "svelte/store";
	import Elementary from "../lib/audio/audioEngine";
	import { ColourMapping } from "../lib/graphics/colourMapping";
	import SoundingGraphs from "../components/GraphicalExtras/SoundingGraphs.svelte";

	const colourMapping:ColourMapping = new ColourMapping();
	$: modalClicked = false;

	onMount ( async () => {
		// initialise single audiocontext and store it
		const store1= get(audioStore)
		if (!store1.context) {
			const context:AudioContext = new (window["AudioContext"])()
			audioStore.update(store => ({ ...store, context, contextState: 'suspended' }))
			console.log('Assigned audio context for: '+ context.sampleRate + ' SR ')
			audioEngine.set( Elementary.getInstanceOfElementary(context))
			const engine: Elementary = get(audioEngine)
			await engine.mount()
		}

		// initialise speech
			const speech:SpeechSynthesis = window.speechSynthesis
			speechEngine.set(speech)
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
			<img src='graphics/svg/rainbowWave.svg'/>
		</div>
		<div class="modal-content">
			<button class="box p-6 has-background-black-bis has-text-centered" aria-label="Click now to Start" on:click={handleModalClick} >
				<SoundingGraphs size="1"/>
			</button>
		</div>
	</div>

	{/if}
