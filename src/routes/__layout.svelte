<script lang="ts">
	import '../app.scss';
	import Nav from '../components/Nav.svelte';
	import stores from "$lib/stores/Stores";
	import {onMount, setContext} from "svelte";
	import {get} from "svelte/store";
	import Elementary from "../script/audioEngine";
	import {Sound} from "../lib/Globals";

	onMount ( async () => {
		if (!get(stores.__audioEngine)) {
			const actx: AudioContext = new (window["AudioContext"])()
			stores.__actx.set(actx)
			console.log('Single audio context running at: '+ get(stores.__actx).sampleRate + ' SR ')
			stores.__audioEngine.set(new Elementary(actx))
			const engine: Elementary = get(stores.__audioEngine)
			const engineState: string = engine.getState()
			if (engineState === (Sound.MOUNTING || Sound.UNMOUNTED)) await engine.mount()
			console.log('Elementary ' + engineState)
		}
	})

	setContext( 'colour.mapping', stores.__colourMapping)

</script>

<Nav/>

<section class="container has-background-grey-light p-6">
	<slot></slot>
</section>

