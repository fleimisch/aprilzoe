<script>
	import { onMount } from 'svelte';

	const ROWS = 100;
	const COLS = 300;
	const NUM_PARTICLES = ROWS * COLS;
	const THICKNESS = Math.pow(80, 2);
	const SPACING = 3;
	const MARGIN = 100;
	const COLOR = 100;
	const DRAG = 0.95;
	const EASE = 0.25;

	let container;
	let canvas;
	let ctx;
	let list = [];
	let man = false;
	let tog = true;
	let mx, my, w, h;

	const particle = {
		vx: 0,
		vy: 0,
		x: 0,
		y: 0
	};

	function handleResize() {
		w = canvas.width = window.innerWidth;
		h = canvas.height = window.innerHeight;

		// Setup temporary canvas for text
		const tempCanvas = document.createElement('canvas');
		tempCanvas.width = w;
		tempCanvas.height = h;
		const tempCtx = tempCanvas.getContext('2d');

		// Draw text
		const text = 'APRIL ZOE';
		tempCtx.fillStyle = 'white';
		tempCtx.textAlign = 'center';
		tempCtx.textBaseline = 'middle';
		const fontSize = Math.min(w * 0.15, 150); // Responsive font size with max
		tempCtx.font = `700 ${fontSize}px Helvetica`;
		tempCtx.fillText(text, w / 2, h / 2);

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
				b[n] = b[n + 1] = b[n + 2] = COLOR;
				b[n + 3] = 255;
			}

			ctx.putImageData(a, 0, 0);
		}

		requestAnimationFrame(step);
	}

	function handleMouseMove(e) {
		const bounds = container.getBoundingClientRect();
		mx = e.clientX - bounds.left;
		my = e.clientY - bounds.top;
		man = true;
	}

	onMount(() => {
		init();
		step();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<div id="container" bind:this={container} on:mousemove={handleMouseMove}>
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	#container {
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}

	canvas {
		display: block;
	}
</style>
