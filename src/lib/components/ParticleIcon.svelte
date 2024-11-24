<script lang="ts">
	import { onMount } from 'svelte';
	import ParticleText from './ParticleText.svelte';
	export let icon: string;
	export let size: number = 200;
	export let title: string = '';

	let w = size;
	let h = size;
	let container: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let particles: any[] = [];
	let outlineParticles: any[] = [];
	let tog = true;

	const PARTICLE_SPACING = 0.4; // Reduced spacing for better detail
	const OUTLINE_PARTICLE_COUNT = 700; // More outline particles
	const DRAG = 0.85; // Increased drag for faster settling
	const EASE = 0.5; // Increased ease for stronger return to original position
	const COLORS = [
		{ r: 255, g: 255, b: 255 }, // White
		{ r: 147, g: 197, b: 255 }, // Light blue
		{ r: 155, g: 140, b: 255 } // Violet
	];

	const particle = {
		vx: 0,
		vy: 0,
		x: 0,
		y: 0,
		ox: 0, // original x
		oy: 0 // original y
	};

	let width = size;
	let height = size;

	let mx: number, my: number;
	let isMouseOver = false; // Track if mouse is over the canvas

	const THICKNESS = 2000; // Increased thickness for wider mouse influence

	let showTitle = false;

	function handleMouseMove(event: MouseEvent) {
		showTitle = true;
		const rect = canvas.getBoundingClientRect();
		mx = event.clientX - rect.left;
		my = event.clientY - rect.top;
		isMouseOver = true; // Mouse is over the canvas
	}

	function handleMouseLeave() {
		showTitle = false;
		isMouseOver = false; // Mouse has left the canvas
	}

	function extractSVGPoints(svg: string): Promise<ImageData> {
		return new Promise((resolve) => {
			const img = new Image();
			const tempCanvas = document.createElement('canvas');
			const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });

			img.onload = () => {
				tempCanvas.width = w;
				tempCanvas.height = h;

				if (tempCtx) {
					// Clear canvas with black background
					tempCtx.fillStyle = 'black';
					tempCtx.fillRect(0, 0, w, h);

					// Calculate scale to fit icon with padding
					const padding = w * 0.2; // 20% padding
					const scale = Math.min((w - padding * 2) / img.width, (h - padding * 2) / img.height);
					const scaledWidth = img.width * scale;
					const scaledHeight = img.height * scale;
					const x = (w - scaledWidth) / 2;
					const y = (h - scaledHeight) / 2;

					// Draw the SVG in white
					tempCtx.fillStyle = 'white';
					tempCtx.fill();
					tempCtx.drawImage(img, x, y, scaledWidth, scaledHeight);

					resolve(tempCtx.getImageData(0, 0, w, h));
				}
			};

			img.src = icon;
		});
	}

	function initParticles() {
		extractSVGPoints(icon).then((imageData) => {
			const data = imageData.data;
			particles = [];
			outlineParticles = [];

			// Main particles
			for (let y = 0; y < h; y += PARTICLE_SPACING) {
				for (let x = 0; x < w; x += PARTICLE_SPACING) {
					const i = (~~y * w + ~~x) * 4;
					if (data[i] > 80 && Math.random() > 0.3) {
						const p = Object.create(particle);
						p.x = p.ox = x;
						p.y = p.oy = y;
						p.color = COLORS[Math.floor(Math.random() * COLORS.length)];
						particles.push(p);
					}
				}
			}

			// Outline particles
			const centerX = w / 2;
			const centerY = h / 2;
			for (let i = 0; i < OUTLINE_PARTICLE_COUNT; i++) {
				const angle = (Math.PI * 2 * i) / OUTLINE_PARTICLE_COUNT;
				const radius = w * 0.3;
				outlineParticles.push({
					x: centerX + Math.cos(angle) * radius,
					y: centerY + Math.sin(angle) * radius,
					ox: centerX + Math.cos(angle) * radius,
					oy: centerY + Math.sin(angle) * radius,
					vx: 0,
					vy: 0,
					color: COLORS[Math.floor(Math.random() * COLORS.length)]
				});
			}
		});
	}

	function step() {
		const imageData = ctx.createImageData(w, h);
		const data = imageData.data;

		// Draw particles
		for (const p of [...particles, ...outlineParticles]) {
			if (isMouseOver) {
				const dx = mx - p.x;
				const dy = my - p.y;
				const d = dx * dx + dy * dy;
				const f = -THICKNESS / d;

				if (d < THICKNESS && mx !== undefined && my !== undefined) {
					const t = Math.atan2(dy, dx);
					p.vx += f * Math.cos(t);
					p.vy += f * Math.sin(t);
				}
			}

			// Stronger return to original position
			p.x += (p.vx *= DRAG) + (p.ox - p.x) * EASE;
			p.y += (p.vy *= DRAG) + (p.oy - p.y) * EASE;

			const px = ~~p.x;
			const py = ~~p.y;

			if (px >= 0 && px < w && py >= 0 && py < h) {
				const n = (px + py * w) * 4;
				data[n] = p.color.r;
				data[n + 1] = p.color.g;
				data[n + 2] = p.color.b;
				data[n + 3] = 255;
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
	bind:this={container}
	class="particle-icon"
	role="presentation"
	on:mousemove={handleMouseMove}
	on:mouseleave={handleMouseLeave}
	style="width: {size}px; height: {size}px;"
>
	<canvas bind:this={canvas} {width} {height} class="particle-canvas"></canvas>
	<ParticleText text={title} size={size * 0.2} className={showTitle ? 'title-overlay' : ''} />
</div>

<style>
	.particle-icon {
		position: relative;
		overflow: hidden;
	}

	.particle-canvas {
		display: block;
		mask-image: radial-gradient(circle at center, black 30%, transparent 70%);
		-webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 70%);
	}

	.title-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
	}
</style>
