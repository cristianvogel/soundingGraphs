<script lang="ts">
	import '../app.scss';
	import Nav from '../components/Nav.svelte';
	import {
		audioEngine,
		audioStore
	} from "../lib/stores/audioStores";
	import {onMount, setContext} from "svelte";
	import {get} from "svelte/store";
	import Elementary from "../lib/audio/audioEngine";
	import { ColourMapping } from "../lib/graphics/colourMapping";

	const colourMapping = new ColourMapping();

	onMount ( async () => {
		const store = get(audioStore)
		if (!store.context) {
			const context:AudioContext = new (window["AudioContext"])()
			audioStore.update(store => ({ ...store, context, contextState: 'suspended' }))
			console.log('Assigned audio context for: '+ context.sampleRate + ' SR ')
			audioEngine.set( Elementary.getInstanceOfElementary(context))
			const engine: Elementary = get(audioEngine)
			await engine.mount()
		}
	})

	setContext( 'colour.mapping', colourMapping)

</script>

<Nav />

<section class="container has-background-grey-light p-6">
	<slot></slot>
</section>

