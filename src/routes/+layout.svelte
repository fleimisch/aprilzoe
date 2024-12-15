<script lang="ts">
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { onMount } from 'svelte';
	import { device } from '$lib/stores/device';
	import Header from '$lib/components/Header.svelte';
	import { config } from '$lib/stores/appStates.svelte';
	import '../app.css';

	let { children } = $props();
	let isMounted = $state(false);
	let BODY: HTMLElement;
	onMount(() => {
		const cleanup = device.init();
		isMounted = true;
		if (import.meta.env.PROD) {
			injectAnalytics();
		}
		return cleanup;
	});

	$effect(() => {
		if (config.isHamburgerOpen) {
			BODY.classList.add('overflow-hidden');
		} else {
			BODY.classList.remove('overflow-hidden');
		}
	});
</script>

<svelte:body bind:this={BODY} />

<Header />
{#if isMounted}
	<div class="layoutPageFrame">
		{@render children()}
	</div>
{/if}
