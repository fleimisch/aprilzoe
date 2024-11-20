<script lang="ts">
	import { onMount } from 'svelte';

	const { text = $bindable('APRIL ZOE') } = $props();

	const ROWS = 300;
	let COLS: number;
	const SPACING = 5;
	let THICKNESS = Math.pow(80, 2.3);
	const MARGIN = 100;
	const COLOR = 100;
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

	function handleResize() {
		w = canvas.width = window.innerWidth;
		h = canvas.height = window.innerHeight + 400;

		// Calculate COLS based on window width and spacing
		COLS = Math.floor(w / SPACING);
		const NUM_PARTICLES = ROWS * COLS;

		// Setup temporary canvas for text
		const tempCanvas = document.createElement('canvas');
		tempCanvas.width = w;
		tempCanvas.height = h;
		const tempCtx = tempCanvas.getContext('2d');

		// Draw text
		if (tempCtx) {
			tempCtx.fillStyle = 'white';
			tempCtx.textAlign = 'center';
			tempCtx.textBaseline = 'middle';
			const fontSize = Math.min(w * 0.15, 150); // Responsive font size with max
			tempCtx.font = `800 ${fontSize}px "Open Sans"`;
			tempCtx.fillText(text, w / 2, h / 2 - 200);
			// Get pixel data
			const imageData = tempCtx.getImageData(0, 0, w, h).data;

			const totalWidth = COLS * SPACING;
			const totalHeight = ROWS * SPACING;
			const startX = (w - totalWidth) / 2;
			const startY = (h - totalHeight) / 2;

			list = [];
			for (let i = 0; i < NUM_PARTICLES; i++) {
				const col = i % COLS;
				const row = Math.floor(i / COLS);
				const x = startX + SPACING * col;
				const y = startY + SPACING * row;

				// Check if this position overlaps with text
				const pixelIndex = (Math.floor(y) * w + Math.floor(x)) * 4;
				if (imageData[pixelIndex] === 0) {
					// If pixel is black (no text)
					const p = Object.create(particle);
					p.x = p.ox = x;
					p.y = p.oy = y;
					list.push(p);
				}
			}
		}
	}

	function init() {
		ctx = canvas.getContext('2d');
		handleResize();
		window.addEventListener('resize', handleResize);
	}

	function step() {
		if ((tog = !tog)) {
			if (!man) {
				const t = +new Date() * 0.001;
				mx = w * 0.5 + Math.cos(t * 2.1) * Math.cos(t * 0.9) * w * 0.45;
				my = h * 0.5 + Math.sin(t * 3.2) * Math.tan(Math.sin(t * 0.8)) * h * 0.45;
			}

			for (let i = 0; i < list.length; i++) {
				const p = list[i];

				const dx = mx - p.x;
				const dy = my - p.y;
				const d = dx * dx + dy * dy;
				const f = -THICKNESS / d;

				if (d < THICKNESS) {
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

			for (let i = 0; i < list.length; i++) {
				const p = list[i];
				const n = (~~p.x + ~~p.y * w) * 4;

				// Calculate fade based on y position
				const fadeStart = h - 400; // Start fading 400px from bottom
				const fadeEnd = h - 100; // Complete fade 100px from bottom
				let alpha = 255;

				if (p.y > fadeStart) {
					alpha = 255 * (1 - (p.y - fadeStart) / (fadeEnd - fadeStart));
					alpha = Math.max(0, Math.min(255, alpha)); // Clamp between 0-255
				}

				b[n] = b[n + 1] = b[n + 2] = COLOR;
				b[n + 3] = alpha;
			}

			ctx.putImageData(a, 0, 0);
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
		loadFont();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	$effect(() => {
		handleResize();
	});
</script>

<div id="container" bind:this={container} on:mousemove={handleMouseMove} role="presentation">
	<canvas bind:this={canvas}></canvas>
	<div class="slider-container">
		<input type="range" min="2000" max="200000" bind:value={THICKNESS} orient="vertical" />
	</div>
</div>

<style>
	#container {
		left: 0;
		top: 0;
		width: 100vw;
		height: 150vh;
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

	input[type='range'] {
		appearance: slider-vertical;
		height: 100%;
		cursor: pointer;
		background: transparent;
	}
	/* Webkit (Chrome, Safari, Edge) styles */
	input[type='range'][orient='vertical'] {
		width: 2px;
		writing-mode: bt-lr;
		-webkit-appearance: slider-vertical;
	}

	input[type='range']::-webkit-slider-runnable-track {
		width: 4px;
		background: #2c2b2b;
		border-radius: 4px;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		height: 20px;
		width: 10px;
		border-radius: 50%;
		background: #666;
		margin-left: -6px;
		border: 2px solid #888;
		cursor: pointer;
	}

	/* Firefox styles */
	@-moz-document url-prefix() {
		input[type='range'][orient='vertical'] {
			writing-mode: bt-lr;
			width: 8px;
			height: 100%;
			background: #333;
			border-radius: 4px;
		}

		input[type='range']::-moz-range-track {
			background: #333;
			width: 8px;
			border-radius: 4px;
		}

		input[type='range']::-moz-range-thumb {
			height: 20px;
			width: 20px;
			border-radius: 50%;
			background: #666;
			border: 2px solid #888;
			cursor: pointer;
		}
	}
</style>
