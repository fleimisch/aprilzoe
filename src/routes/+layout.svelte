<script lang="ts">
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { onMount } from 'svelte';
	import '../app.css';
	let { children } = $props();
	onMount(() => {
		if (import.meta.env.PROD) {
			injectAnalytics();
		}
	});
</script>

{@render children()}
