<script lang="ts">
	import ScrollDownIcon from '$lib/components/elements/ScrollDownIcon.svelte';
	import ParticleAnimation from '$lib/components/ParticleAnimation.svelte';
	let heroText = $state('APRIL ZOE');
</script>

<!-- <input type="text" bind:value={heroText} /> -->
<div class="relative" style="padding-bottom: 100vh">
	<ScrollDownIcon />
	<ParticleAnimation bind:text={heroText} />
</div>

<div class="glow"></div>
<div class="glow second"></div>

<div class="container mx-auto px-2 md:px-20">
	<div class="flex flex-col gap-10">
		<h1
			class="w-full bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text font-sans text-5xl font-extrabold uppercase text-transparent md:text-7xl xl:w-3/4"
		>
			Sentinel, Content creator, gamer, degen
		</h1>

		<div class=" flex flex-col gap-4 md:w-2/3">
			<p class="text-2xl leading-normal text-white/75">
				April Zoe, a passionate crypto enthusiast, is committed to advancing decentralization and
				privacy to transform online identity, reputation, and trust.
			</p>

			<p class="text-2xl leading-normal text-white/75">
				As a content creator, moderator, and community manager, she leverages her socials to raise
				awareness and promote solutions centered on decentralized identity, Web3 gaming, and
				communities. Her efforts focus on enhancing transparency, reputation management, and user
				empowerment.
			</p>
		</div>
	</div>
</div>

<!-- 
<div class="absolute bottom-40 left-0 flex w-full items-center justify-center">
	<a href="/about" class="open-sans-bold text-1xl text-white">Follow</a>
</div> -->

<style>
	.glow {
		position: absolute;
		top: 40%;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		filter: blur(300px);
		z-index: -1;
		background: linear-gradient(182deg, #03030300, #c503f546);
	}

	.glow.second {
		top: 60%;
		height: 200px;
		filter: blur(200px);
		background: linear-gradient(182deg, #03030300, #0303f542);
	}
</style>
