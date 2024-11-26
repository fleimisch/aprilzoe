<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let { particleSpace = 0.8 } = $props();

	let w: number;
	let h: number;
	let container: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let particles: any[] = [];
	let backgroundParticles: any[] = [];
	let outlineParticles: any[] = [];
	let tog = true;
	let mx = 0,
		my = 0;

	const BACKGROUND_PARTICLES_COUNT = 400;
	const SPACING = 3;
	const THICKNESS = Math.pow(80, 2.1);
	const DRAG = 0.95;
	const EASE = 0.25;
	const MOVE_SPEED = 0.03;
	const SIZE_SPEED = 0.02;
	const COLORS = [
		{ r: 255, g: 255, b: 255 }, // White
		{ r: 147, g: 197, b: 255 }, // Light blue
		{ r: 155, g: 140, b: 255 } // Violet
	];

	const particle = {
		vx: 0,
		vy: 0,
		x: 0,
		y: 0
	};

	const FLOAT_AMPLITUDE = 5; // How far up/down to float
	const FLOAT_SPEED = 0.001; // How fast to float

	let isInView = true;
	let observer: IntersectionObserver;
	let imageData: ImageData;
	let animationFrameId: number | null = null;

	function extractSVGPoints(svgPath: string): Promise<ImageData> {
		return new Promise((resolve) => {
			const img = new Image();
			const tempCanvas = document.createElement('canvas');
			const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });

			// Request the SVG file
			fetch(svgPath)
				.then((response) => response.text())
				.then((svgContent) => {
					// Parse the SVG content
					const parser = new DOMParser();
					const result = parser.parseFromString(svgContent, 'text/xml');
					const inlineSVG = result.getElementsByTagName('svg')[0];

					// Add explicit width and height attributes for Firefox
					inlineSVG.setAttribute('width', '1000px');
					inlineSVG.setAttribute('height', '1000px');

					// Convert the modified SVG to a data URI
					const svg64 = btoa(new XMLSerializer().serializeToString(inlineSVG));
					const image64 = 'data:image/svg+xml;base64,' + svg64;

					// Set the image source
					img.onload = () => {
						tempCanvas.width = w;
						tempCanvas.height = h;

						if (tempCtx) {
							// Clear canvas with black background
							tempCtx.fillStyle = 'black';
							tempCtx.fillRect(0, 0, w, h);

							// Center and scale the image
							const scale = Math.min(w / img.width, h / img.height) * 0.65;
							const scaledWidth = img.width * scale;
							const scaledHeight = img.height * scale;
							const x = (w - scaledWidth) / 2;
							const y = (h - scaledHeight) / 2;

							// Draw the SVG in white
							tempCtx.fillStyle = 'white';
							tempCtx.drawImage(img, x, y, scaledWidth, scaledHeight);

							resolve(tempCtx.getImageData(0, 0, w, h));
						}
					};

					img.src = image64;
				})
				.catch((error) => {
					console.error('Error loading or processing SVG:', error);
				});
		});
	}

	function initParticles() {
		let POINT_SPACING = particleSpace;

		extractSVGPoints('/spaceman-big.svg').then((imageData) => {
			const data = imageData.data;
			particles = [];

			for (let y = 0; y < h; y += POINT_SPACING) {
				for (let x = 0; x < w; x += POINT_SPACING) {
					const i = (~~y * w + ~~x) * 4;
					if (data[i] > 80 && Math.random() > 0.15) {
						const p = Object.create(particle);
						p.x = p.ox = x;
						p.y = p.oy = y;
						particles.push(p);
					}
				}
			}
		});
	}

	function initBackgroundParticles() {
		const centerX = w / 2;
		const centerY = h / 2;

		for (let i = 0; i < BACKGROUND_PARTICLES_COUNT; i++) {
			const angle = Math.random() * Math.PI * 2;
			const radius = 100 + Math.random() * 400;

			backgroundParticles.push({
				x: centerX + Math.cos(angle) * radius,
				y: centerY + Math.sin(angle) * radius,
				radius,
				angle,
				speed: 0.05 + Math.random() * 0.1,
				seed: Math.random() * 1000,
				size: 1,
				color: COLORS[Math.floor(Math.random() * COLORS.length)],
				vx: 0,
				vy: 0,
				ox: centerX + Math.cos(angle) * radius,
				oy: centerY + Math.sin(angle) * radius
			});
		}
	}

	function initOutlineParticles() {
		const centerX = w / 2;
		const centerY = h / 2;

		for (let i = 0; i < BACKGROUND_PARTICLES_COUNT; i++) {
			const angle = Math.random() * Math.PI * 2;
			const radius = 100 + Math.random() * 400;

			outlineParticles.push({
				x: centerX + Math.cos(angle) * radius,
				y: centerY + Math.sin(angle) * radius,
				radius,
				angle,
				speed: 0.05 + Math.random() * 0.1,
				seed: Math.random() * 1000,
				size: 1,
				color: COLORS[Math.floor(Math.random() * COLORS.length)],
				vx: 0,
				vy: 0,
				ox: centerX + Math.cos(angle) * radius,
				oy: centerY + Math.sin(angle) * radius
			});
		}
	}

	function handleResize() {
		w = canvas.width = 1000;
		h = canvas.height = 1000;
		particles = [];
		backgroundParticles = [];
		outlineParticles = [];
		initParticles();
		initBackgroundParticles();
		initOutlineParticles();
	}

	function step() {
		if (!ctx) return;

		// Only render when in view or nearby
		if (isInView) {
			const centerX = w / 2;
			const centerY = h / 2;

			if ((tog = !tog)) {
				const time = Date.now() * FLOAT_SPEED;
				const floatOffset = Math.sin(time) * FLOAT_AMPLITUDE;

				// Mouse interaction for background particles
				for (const p of backgroundParticles) {
					const dx = mx - p.x;
					const dy = my - p.y;
					const d = dx * dx + dy * dy;
					const f = -THICKNESS / d;

					if (d < THICKNESS) {
						const t = Math.atan2(dy, dx);
						p.vx += f * Math.cos(t);
						p.vy += f * Math.sin(t);
					}

					p.x += p.vx *= DRAG;
					p.y += p.vy *= DRAG;

					const targetX = centerX + Math.cos(p.angle) * p.radius;
					const targetY = centerY + Math.sin(p.angle) * p.radius;

					p.x += (targetX - p.x) * EASE;
					p.y += (targetY - p.y) * EASE;

					p.angle += p.speed * 0.01;
				}

				// Mouse interaction for main particles
				for (const p of particles) {
					const dx = mx - p.currentX;
					const dy = my - p.currentY;
					const d = dx * dx + dy * dy;
					const f = -THICKNESS / d;

					if (d < THICKNESS) {
						const t = Math.atan2(dy, dx);
						p.vx += f * Math.cos(t);
						p.vy += f * Math.sin(t);
					}

					// Add some random movement to simulate dynamics
					p.vx += (Math.random() - 0.5) * 0.1;
					p.vy += (Math.random() - 0.5) * 0.1;

					// Add floating motion
					const floatingY = p.y + floatOffset;

					p.currentX += (p.vx *= DRAG) + (p.x - p.currentX) * EASE;
					p.currentY += (p.vy *= DRAG) + (floatingY - p.currentY) * EASE;
				}
			} else {
				// Reuse ImageData instance
				if (!imageData) {
					imageData = ctx.createImageData(w, h);
				}
				const data = imageData.data;
				data.fill(0);

				// Draw background particles
				for (const p of backgroundParticles) {
					const dotSize = 1;
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

				// Draw outline particles
				for (const p of outlineParticles) {
					const time = Date.now() * 0.001;
					const angle = Math.atan2(p.y - centerY, p.x - centerX);
					const wave = Math.sin(time * 3 + angle * 4) * 1;
					const offsetX = p.x + Math.cos(angle) * wave;
					const offsetY = p.y + Math.sin(angle) * wave;

					const dotSize = 1;

					// Draw outline particle
					for (let dx = 0; dx < dotSize; dx++) {
						for (let dy = 0; dy < dotSize; dy++) {
							const nx = ~~(offsetX + dx);
							const ny = ~~(offsetY + dy);
							if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
								const n = (nx + ny * w) * 4;
								data[n] = 255;
								data[n + 1] = 255;
								data[n + 2] = 255;
								data[n + 3] = 255;
							}
						}
					}
				}

				// Draw spaceman particles
				for (const p of particles) {
					if (!p.seed) {
						p.seed = Math.random() * 1000;
						p.currentX = p.x;
						p.currentY = p.y;
						p.vx = 0;
						p.vy = 0;
						p.color = COLORS[Math.floor(Math.random() * COLORS.length)];
					}

					const dotSize = 1;
					const px = ~~p.currentX;
					const py = ~~p.currentY;

					// Draw particle
					for (let dx = 0; dx < dotSize; dx++) {
						for (let dy = 0; dy < dotSize; dy++) {
							const nx = px + dx;
							const ny = py + dy;
							if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
								const n = (nx + ny * w) * 4;
								data[n] = p.color.r;
								data[n + 1] = p.color.g;
								data[n + 2] = p.color.b;
								data[n + 3] = 255;
							}
						}
					}
				}

				ctx.putImageData(imageData, 0, 0);
			}
		}

		animationFrameId = requestAnimationFrame(step);
	}

	function handleMouseMove(e: MouseEvent) {
		const bounds = container.getBoundingClientRect();
		mx = e.clientX - bounds.left;
		my = e.clientY - bounds.top;
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		handleResize();
		window.addEventListener('resize', handleResize);

		// Setup intersection observer
		observer = new IntersectionObserver(
			(entries) => {
				isInView = entries[0].isIntersecting;
			},
			{ rootMargin: '100px' }
		);

		observer.observe(container);
		step();

		return () => {
			window.removeEventListener('resize', handleResize);
			observer.disconnect();
		};
	});

	onDestroy(() => {
		// Cancel any pending animations
		if (animationFrameId !== null) {
			cancelAnimationFrame(animationFrameId);
		}

		// Clear all particle arrays
		particles = [];
		backgroundParticles = [];
		outlineParticles = [];

		// Clear canvas context
		if (ctx) {
			ctx.clearRect(0, 0, w, h);
			// @ts-ignore
			ctx = null;
		}

		// Clear canvas reference
		// @ts-ignore
		canvas = null;

		// Clear container reference
		// @ts-ignore
		container = null;

		// Clear ImageData reference
		// @ts-ignore
		imageData = null;

		// Clear event listeners
		window.removeEventListener('resize', handleResize);

		// Disconnect the intersection observer
		if (observer) {
			observer.disconnect();
			// @ts-ignore
			observer = null;
		}
	});
</script>

<div
	bind:this={container}
	on:mousemove={handleMouseMove}
	class="spaceman-container"
	style="transform: translateZ(0); contain: content;"
>
	<canvas bind:this={canvas} style="transform: translateZ(0)"></canvas>
</div>

<style>
	.spaceman-container {
		position: absolute;
		left: 0;
		top: 0;
		width: 1000px;
		height: 1000px;
		overflow: hidden;
		will-change: transform;
		contain: content;
	}

	canvas {
		display: block;
		will-change: transform;
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
	}
</style>
