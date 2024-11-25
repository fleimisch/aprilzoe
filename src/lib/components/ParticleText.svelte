<script lang="ts">
	export let text: string = '';
	export let size: number = 14;
	export let className: string = '';
</script>

<div class="sans-serif flex items-center justify-center {className}">
	<span
		class="bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-center text-5xl font-bold"
		style="font-size: {size}px;">{text}</span
	>
</div>

<style>
</style>
