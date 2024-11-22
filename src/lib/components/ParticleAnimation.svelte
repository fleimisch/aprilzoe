<script lang="ts">
	import { onMount } from 'svelte';

	const { text = $bindable('APRIL ZOE') } = $props();

	const ROWS = 300;
	let COLS: number;
	const SPACING = 5;
	let THICKNESS = $state(Math.pow(80, 2.6));
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

	let outlineCanvas: any;
	let outlineCtx: any;
	let strokeOffset = 0;

	let canvasWidth: number;
	let canvasHeight: number;

	let outlineList: any[] = [];
	const OUTLINE_SPACING = 2;

	let handlePosition = $derived(((THICKNESS - 2000) / (200000 - 2000)) * 100);

	function handleResize() {
		w = canvas.width = window.innerWidth;
		h = canvas.height = window.innerHeight + 400;

		// Update outline canvas dimensions too
		if (outlineCanvas) {
			outlineCanvas.width = w;
			outlineCanvas.height = h;
		}

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
			// First, draw filled text for main particles
			tempCtx.fillStyle = 'white';
			tempCtx.textAlign = 'center';
			tempCtx.textBaseline = 'middle';
			const fontSize = Math.min(w * 0.15, 150);
			tempCtx.font = `800 ${fontSize}px "Open Sans"`;
			tempCtx.fillText(text, w / 2, h / 2 - 200);

			// Get pixel data for filled text
			const imageData = tempCtx.getImageData(0, 0, w, h).data;

			// Clear canvas
			tempCtx.clearRect(0, 0, w, h);

			// Now draw stroked text for outline particles
			tempCtx.strokeStyle = 'white';
			tempCtx.lineWidth = 1;
			tempCtx.strokeText(text, w / 2, h / 2 - 200);

			// Get pixel data for outline
			const outlineData = tempCtx.getImageData(0, 0, w, h).data;

			// Setup particles for main text
			list = [];
			outlineList = [];

			// Create outline particles
			for (let y = 0; y < h; y += OUTLINE_SPACING) {
				for (let x = 0; x < w; x += OUTLINE_SPACING) {
					const pixelIndex = (y * w + x) * 4;
					if (outlineData[pixelIndex] > 0 && imageData[pixelIndex] === 0) {
						const p = Object.create(particle);
						p.x = p.ox = x;
						p.y = p.oy = y;
						outlineList.push(p);
					}
				}
			}

			// Existing particle creation code for filled text...
			const totalWidth = COLS * SPACING;
			const totalHeight = ROWS * SPACING;
			const startX = (w - totalWidth) / 2;
			const startY = (h - totalHeight) / 2;

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
			// Update both main and outline particles
			const allParticles = [...list, ...outlineList];
			for (let i = 0; i < allParticles.length; i++) {
				const p = allParticles[i];
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

		loadFont().then(() => {
			outlineCtx = outlineCanvas.getContext('2d');
		});

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	$effect(() => {
		handleResize();
	});

	// Add these functions to handle dragging
	function startDrag(e: MouseEvent) {
		const track = e.currentTarget.parentElement;
		if (!track) return;

		const handleDrag = (e: MouseEvent) => {
			const rect = track.getBoundingClientRect();
			const percentage = 1 - Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
			THICKNESS = 2000 + percentage * (200000 - 2000);
			e.preventDefault();
		};

		const stopDrag = () => {
			window.removeEventListener('mousemove', handleDrag);
			window.removeEventListener('mouseup', stopDrag);
		};

		// Initial drag position
		const rect = track.getBoundingClientRect();
		const percentage = 1 - Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
		THICKNESS = 2000 + percentage * (200000 - 2000);

		window.addEventListener('mousemove', handleDrag);
		window.addEventListener('mouseup', stopDrag);

		e.preventDefault();
	}
</script>

<div id="container" bind:this={container} on:mousemove={handleMouseMove} role="presentation">
	<canvas bind:this={canvas}></canvas>
	<div class="slider-container">
		<div class="fader-track">
			<div class="fader-handle" style="bottom: {handlePosition}%" on:mousedown={startDrag}></div>
		</div>
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

	.fader-track {
		width: 2px;
		height: 100%;
		background: #2c2b2b;
		border-radius: 4px;
		position: relative;
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
		background: #666;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.fader-handle::after {
		content: '';
		position: absolute;
		width: 2px;
		height: 20px;
		background: #666;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
