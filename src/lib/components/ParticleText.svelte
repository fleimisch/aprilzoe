<script lang="ts">
	export let text: string = '';
	export let size: number = 20;
	export let className: string = '';
</script>

<div class={className} style="font-size: {size}px;">
	{text}
</div>

<style>
	div {
		color: white;
		font-family: 'Open Sans', sans-serif;
		font-weight: bold;
	}
</style>
