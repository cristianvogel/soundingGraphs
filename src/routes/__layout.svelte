
<script>

	import '../app.scss';
	import Nav from '../components/Nav.svelte';
	import { __colourMapping } from "$lib/stores/generalStores";
	import {setContext} from "svelte";

	setContext( 'colour.mapping', __colourMapping)

</script>
<Nav/>
<section class="container has-background-grey-light p-6">
	<slot></slot>
</section>
