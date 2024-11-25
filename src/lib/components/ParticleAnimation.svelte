<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { device } from '$lib/stores/device';
	const { text = $bindable('APRIL ZOE') } = $props();

	let ROWS = 0;
	let COLS: number;
	const SPACING = 6;
	const baseThickness = Math.pow(80, 2.6);
	let currentThickness = $state(baseThickness);
	const MARGIN = 100;
	const COLOR = 80;
	const DRAG = 0.95;
	const EASE = 0.25;

	let container: any;
	let canvas: any;
	let ctx: any;
	let list: any[] = [];
	let man = false;
	let tog = true;
	let mx: number, my: number, w: number, h: number;

	const particle = {
		vx: 0,
		vy: 0,
		x: 0,
		y: 0
	};

	let outlineCanvas: any;
	let outlineCtx: any;
	let strokeOffset = 0;

	let canvasWidth: number;
	let canvasHeight: number;

	let outlineList: any[] = [];
	const OUTLINE_SPACING = 3;

	let handlePosition = $derived(((currentThickness - 2000) / (200000 - 2000)) * 100);

	// Constants - define the exact thickness values we want
	const INITIAL_THICKNESS = Math.pow(80, 2.6);
	const BREATH_SPEED = 0.0007;

	// State
	let isMouseOut = $state(false);
	let breathingAnimationId: number | null = null;
	let hasInteracted = $state(false);

	// Breathing animation function
	function startBreathing() {
		const breathe = () => {
			const time = Date.now() * BREATH_SPEED;
			const breatheFactor = 5.5 + Math.sin(time) * 0.5;
			currentThickness = INITIAL_THICKNESS * breatheFactor;
			breathingAnimationId = requestAnimationFrame(breathe);
		};
		breathe();
	}

	// Stop breathing animation
	function stopBreathing() {
		if (breathingAnimationId !== null) {
			cancelAnimationFrame(breathingAnimationId);
			breathingAnimationId = null;
		}
	}

	// Mouse handlers
	function handleMouseLeave() {
		if ($device.isDesktop && hasInteracted) {
			isMouseOut = true;
			mx = w / 2;
			my = h * 0.9;
			startBreathing();
		}
	}

	function handleMouseEnter() {
		hasInteracted = true;
		isMouseOut = false;
		stopBreathing();
		currentThickness = INITIAL_THICKNESS;
	}

	// Cleanup on component destruction
	onDestroy(() => {
		stopBreathing();
	});

	// Add throttle utility at the top of the script
	function throttle(func: Function, limit: number) {
		let inThrottle: boolean;
		return function (this: any, ...args: any[]) {
			if (!inThrottle) {
				func.apply(this, args);
				inThrottle = true;
				setTimeout(() => (inThrottle = false), limit);
			}
		};
	}

	// Replace the existing handleResize implementation
	let tmr1: ReturnType<typeof setTimeout>;
	const handleResize = throttle(() => {
		clearTimeout(tmr1);
		tmr1 = setTimeout(() => {
			if (!canvas || !ctx) return;

			w = canvas.width = window.innerWidth;
			h = canvas.height = window.innerHeight + 400;

			// Update outline canvas dimensions
			if (outlineCanvas) {
				outlineCanvas.width = w;
				outlineCanvas.height = h;
			}

			// Calculate COLS once
			COLS = Math.floor(w / SPACING);
			const NUM_PARTICLES = ROWS * COLS;

			// Create temp canvas once
			const tempCanvas = document.createElement('canvas');
			const tempCtx = tempCanvas.getContext('2d');
			if (!tempCtx) return;

			tempCanvas.width = w;
			tempCanvas.height = h;

			// Prepare text rendering settings
			const fontSize = Math.min(w * 0.15, 150);
			tempCtx.font = `800 ${fontSize}px "Open Sans"`;
			tempCtx.textAlign = 'center';
			tempCtx.textBaseline = 'middle';

			// Draw text once and reuse the image data
			tempCtx.fillStyle = 'white';
			tempCtx.fillText(text, w / 2, h / 2 - 200);
			const imageData = tempCtx.getImageData(0, 0, w, h).data;

			// Clear and draw stroke for outline
			tempCtx.clearRect(0, 0, w, h);
			tempCtx.strokeStyle = 'white';
			tempCtx.lineWidth = 1;
			tempCtx.strokeText(text, w / 2, h / 2 - 200);
			const outlineData = tempCtx.getImageData(0, 0, w, h).data;

			// Pre-calculate layout values
			const totalWidth = COLS * SPACING;
			const totalHeight = ROWS * SPACING;
			const startX = 0; //(w - totalWidth) / 2;
			const startY = 0; //(h - totalHeight) / 2;

			// Reset particle arrays with estimated capacity
			list = [];
			outlineList = [];
			list.length = 0;
			outlineList.length = 0;

			// Create outline particles more efficiently
			for (let y = 0; y < h; y += OUTLINE_SPACING) {
				for (let x = 0; x < w; x += OUTLINE_SPACING - 1) {
					const pixelIndex = (y * w + x) * 4;
					if (outlineData[pixelIndex] > 0 && imageData[pixelIndex] === 0) {
						outlineList.push({
							...particle,
							x: x,
							y: y,
							ox: x,
							oy: y
						});
					}
				}
			}

			// Create main particles more efficiently
			for (let i = 0; i < NUM_PARTICLES; i++) {
				const col = i % COLS;
				const row = Math.floor(i / COLS);
				const x = startX + SPACING * col;
				const y = startY + SPACING * row;
				const pixelIndex = (Math.floor(y) * w + Math.floor(x)) * 4;

				if (imageData[pixelIndex] === 0) {
					list.push({
						...particle,
						x: x,
						y: y,
						ox: x,
						oy: y
					});
				}
			}
		}, 20); // Debounce delay
	}, 60); // Throttle to ~60fps

	function init() {
		ctx = canvas.getContext('2d');
		handleResize();
		window.addEventListener('resize', handleResize);
	}

	function step() {
		if ((tog = !tog)) {
			// Update both main and outline particles
			const allParticles = [...list, ...outlineList];
			for (let i = 0; i < allParticles.length; i++) {
				const p = allParticles[i];
				const dx = mx - p.x;
				const dy = my - p.y;
				const d = dx * dx + dy * dy;
				const f = -currentThickness / d;

				if (d < currentThickness) {
					const t = Math.atan2(dy, dx);
					p.vx += f * Math.cos(t);
					p.vy += f * Math.sin(t);
				}

				p.x += (p.vx *= DRAG) + (p.ox - p.x) * EASE;
				p.y += (p.vy *= DRAG) + (p.oy - p.y) * EASE;
			}
		} else {
			const a = ctx.createImageData(w, h);
			const b = a.data;

			// Draw main particles
			for (let i = 0; i < list.length; i++) {
				const p = list[i];
				const n = (~~p.x + ~~p.y * w) * 4;

				const fadeStart = h - 400;
				const fadeEnd = h - 100;
				let alpha = 255;

				if (p.y > fadeStart) {
					alpha = 255 * (1 - (p.y - fadeStart) / (fadeEnd - fadeStart));
					alpha = Math.max(0, Math.min(255, alpha));
				}

				b[n] = b[n + 1] = b[n + 2] = COLOR;
				b[n + 3] = alpha;
			}

			// Draw outline particles
			for (let i = 0; i < outlineList.length; i++) {
				const p = outlineList[i];
				const time = Date.now() * 0.001;

				// Calculate letter width approximation
				const letterWidth = Math.min(w * 0.15, 150) * 0.8; // 80% of font size
				const letterSpacing = letterWidth * 1.2; // Add some space between letters

				// Find the nearest letter center
				const textStart = w / 2 - (text.length * letterSpacing) / 2;
				let nearestCenter = { x: w / 2, y: h / 2 - 200 };
				let minDist = Infinity;

				for (let j = 0; j < text.length; j++) {
					const letterX = textStart + j * letterSpacing;
					const letterY = h / 2 - 200;
					const dist = Math.pow(p.x - letterX, 2) + Math.pow(p.y - letterY, 2);
					if (dist < minDist) {
						minDist = dist;
						nearestCenter = { x: letterX, y: letterY };
					}
				}

				// Calculate angle based on nearest letter center
				const angle = Math.atan2(p.y - nearestCenter.y, p.x - nearestCenter.x);

				// Create circular wave motion
				const wave = Math.sin(time * 3 + angle * 4) * 1;
				const offsetX = p.x + Math.cos(angle) * wave;
				const offsetY = p.y + Math.sin(angle) * wave;

				// Animate color and use it for size
				const colorWave = (Math.sin(time * 3 + angle * 4) + 1) * 0.5;
				// Dynamic dot size - larger when whiter (colorWave closer to 1)
				const dotSize = 1 + Math.floor(colorWave * 1.3); // Will vary between 1 and 3 pixels

				// Draw the dot with dynamic size
				for (let dx = 0; dx < dotSize; dx++) {
					for (let dy = 0; dy < dotSize; dy++) {
						const n = (~~(offsetX + dx) + ~~(offsetY + dy) * w) * 4;
						b[n] = 255;
						b[n + 1] = Math.floor(192 + (255 - 192) * colorWave);
						b[n + 2] = Math.floor(203 + (255 - 203) * colorWave);
						b[n + 3] = 255;
					}
				}
			}

			ctx.putImageData(a, 0, 0);

			strokeOffset -= 1;
		}

		requestAnimationFrame(step);
	}

	function handleMouseMove(e: MouseEvent) {
		const bounds = container.getBoundingClientRect();
		mx = e.clientX - bounds.left;
		my = e.clientY - bounds.top;
		man = true;
	}

	async function loadFont() {
		try {
			const font = new FontFace(
				'Open Sans',
				'url(https://fonts.gstatic.com/s/opensans/v35/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-mu0SC55I.woff2)',
				{ weight: '800' }
			);

			// Wait for font to load
			await font.load();

			// Add font to document
			document.fonts.add(font);

			// Now that font is loaded, initialize the canvas
			init();
			step();
		} catch (err) {
			console.error('Error loading font:', err);
			// Fallback to init without custom font
			init();
			step();
		}
	}

	onMount(() => {
		canvasWidth = window.innerWidth;
		canvasHeight = window.innerHeight + 400;
		ROWS = Math.floor(canvasHeight / 5);

		// Initialize canvas first
		if (canvas) {
			ctx = canvas.getContext('2d');
			outlineCtx = outlineCanvas.getContext('2d');

			w = canvas.width = window.innerWidth;
			h = canvas.height = window.innerHeight + 400;

			if (outlineCanvas) {
				outlineCanvas.width = w;
				outlineCanvas.height = h;
			}

			// Set initial mouse position far outside the visible area
			mx = -1000;
			my = -1000;

			loadFont().then(() => {
				init();
				step();
			});
		}

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	// Add these functions to handle dragging
	function startDrag(e: MouseEvent) {
		const track = (e.currentTarget as HTMLElement)?.parentElement;
		if (!track) return;

		const handleDrag = (e: MouseEvent) => {
			const rect = track.getBoundingClientRect();
			const percentage = 1 - Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
			currentThickness = 2000 + percentage * (200000 - 2000);
			e.preventDefault();
		};

		const stopDrag = () => {
			window.removeEventListener('mousemove', handleDrag);
			window.removeEventListener('mouseup', stopDrag);
		};

		// Initial drag position
		const rect = track.getBoundingClientRect();
		const percentage = 1 - Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
		currentThickness = 2000 + percentage * (200000 - 2000);

		window.addEventListener('mousemove', handleDrag);
		window.addEventListener('mouseup', stopDrag);

		e.preventDefault();
	}
</script>

<div
	id="container"
	bind:this={container}
	on:mousemove={handleMouseMove}
	on:mouseleave={handleMouseLeave}
	on:mouseenter={handleMouseEnter}
	role="presentation"
>
	<canvas bind:this={canvas}></canvas>
	<canvas bind:this={outlineCanvas} style="display: none;"></canvas>
	<div class="slider-container">
		<div class="fader-track" class:fade-out={isMouseOut}>
			<div class="fader-handle" style="bottom: {handlePosition}%" on:mousedown={startDrag}></div>
		</div>
	</div>
</div>

<style>
	#container {
		left: 0;
		top: 0;
		width: 100vw;
		height: 200vh;
		overflow: hidden;
		position: absolute;
	}

	canvas {
		display: block;
	}

	.slider-container {
		position: absolute;
		right: 40px;
		top: 30%;
		transform: translateY(-50%);
		height: 200px;
		display: flex;
		align-items: center;
	}

	.fader-track {
		width: 2px;
		height: 100%;
		background: #2c2b2b;
		border-radius: 4px;
		position: relative;
		opacity: 1;
		transition: opacity 0.3s ease;
		visibility: visible;
	}

	.fade-out {
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
	}

	.fader-handle {
		position: absolute;
		width: 30px;
		height: 30px;
		left: 50%;
		transform: translateX(-50%);
		cursor: pointer;
		user-select: none;
		-webkit-user-select: none;
	}

	.fader-handle::before {
		content: '';
		position: absolute;
		width: 20px;
		height: 2px;
		background: #9b9b9b;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.fader-handle::after {
		content: '';
		position: absolute;
		width: 2px;
		height: 20px;
		background: #9b9b9b;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
