<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	const { size = 100, className = '' } = $props();

	let w = size;
	let h = size;
	let container: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let particles: any[] = [];

	const PARTICLES_COUNT = 800;
	const EASE = 0.25;
	const COLORS = [
		{ r: 255, g: 255, b: 255 }, // White
		{ r: 147, g: 197, b: 255 }, // Light blue
		{ r: 155, g: 140, b: 255 } // Violet
	];

	function initParticles() {
		const centerX = w / 2;
		const centerY = h / 2;

		particles = Array.from({ length: PARTICLES_COUNT }, () => {
			const angle = Math.random() * Math.PI * 2;
			const radius = 100 + Math.random() * size;
			const x = centerX + Math.cos(angle) * radius;
			const y = centerY + Math.sin(angle) * radius;

			return {
				x,
				y,
				radius,
				angle,
				speed: 0.05 + Math.random() * 0.0001,
				seed: Math.random() * 1000,
				size: 1 + Math.random() * 0.1,
				color: COLORS[Math.floor(Math.random() * COLORS.length)]
			};
		});
	}

	function step() {
		const imageData = ctx.createImageData(w, h);
		const data = imageData.data;
		const centerX = w / 2;
		const centerY = h / 2;
		const time = Date.now() * 0.001;

		// Update and draw particles
		for (const p of particles) {
			// Orbit motion
			const angle = p.angle + p.speed * 0.01;
			p.angle = angle;

			// Calculate new position
			p.x += (centerX + Math.cos(angle) * p.radius - p.x) * EASE;
			p.y += (centerY + Math.sin(angle) * p.radius - p.y) * EASE;

			// Add subtle size pulsing
			const sizePulse = Math.sin(time * 2 + p.seed) * 0.5 + 1;
			const currentSize = p.size * sizePulse;

			// Draw particle with dynamic size
			const px = ~~p.x;
			const py = ~~p.y;

			// Optimize boundary checks
			const maxX = Math.min(px + currentSize, w);
			const maxY = Math.min(py + currentSize, h);

			for (let nx = Math.max(0, px); nx < maxX; nx++) {
				for (let ny = Math.max(0, py); ny < maxY; ny++) {
					const n = (nx + ny * w) * 4;
					data[n] = p.color.r;
					data[n + 1] = p.color.g;
					data[n + 2] = p.color.b;
					data[n + 3] = 255;
				}
			}
		}

		ctx.putImageData(imageData, 0, 0);
		requestAnimationFrame(step);
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		initParticles();
		step();
	});
</script>

<div
	transition:fade={{ duration: 1000 }}
	bind:this={container}
	class="starfield-container {className}"
	style="width: {size}px; height: {size}px;"
>
	<canvas bind:this={canvas} width={w} height={h} />
</div>

<style>
	.starfield-container {
		position: absolute;
		overflow: hidden;
	}

	canvas {
		display: block;
		mask-image: radial-gradient(circle at center, black 30%, transparent 70%);
		-webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 70%);
	}
</style>
