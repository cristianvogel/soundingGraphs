<script>
  import Icon from "@iconify/svelte";
  export let size = 20
  export let isNavbar = true
  const look = `is-size-4 ${isNavbar ? 'navbar-item' : '' }`
</script>

<div class={look} style="transform: scale({size})">
  <Icon icon="mdi-volume-source"></Icon>
</div>
