<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<article>
	<h1>{data.meta.title}</h1>
	<time datetime={data.meta.date}>
		{new Date(data.meta.date).toLocaleDateString()}
	</time>

	<div class="content">
		<svelte:component this={data.content} />
	</div>
</article>

<style>
	article {
		max-width: 80ch;
		margin: 0 auto;
		padding: 1rem;
	}

	.content {
		margin-top: 2rem;
	}
</style>
