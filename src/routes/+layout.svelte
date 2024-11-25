<script lang="ts">
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { onMount } from 'svelte';
	import { device } from '$lib/stores/device';
	import '../app.css';
	let { children } = $props();
	let isMounted = $state(false);
	onMount(() => {
		const cleanup = device.init();
		isMounted = true;
		if (import.meta.env.PROD) {
			injectAnalytics();
		}
		return cleanup;
	});
</script>

{#if isMounted}
	{@render children()}
{/if}
