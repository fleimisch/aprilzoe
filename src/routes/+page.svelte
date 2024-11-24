<script lang="ts">
	import ScrollDownIcon from '$lib/components/elements/ScrollDownIcon.svelte';
	import ParticleAnimation from '$lib/components/ParticleAnimation.svelte';
	import Spaceman from '$lib/components/Spaceman.svelte';
	import ParticleIcon from '$lib/components/ParticleIcon.svelte';
	let heroText = $state('APRIL ZOE');
	let y: number = $state(0);
</script>

<svelte:window bind:scrollY={y} />

<!-- <input type="text" bind:value={heroText} /> -->
<ScrollDownIcon />
<div class="relative" style="padding-bottom: 200vh">
	<ParticleAnimation bind:text={heroText} />
</div>

<div class="glow"></div>
<div class="glow second"></div>

<div class="content-frame container relative mx-auto mb-20 flex flex-col gap-20 px-6 md:px-20">
	<div
		class="spaceman-wrap absolute right-0 top-0"
		style="top: 400px; transform: translateY({-y * 0.5}px) "
	>
		<!-- <img
			src="/spaceman-2-bw.png"
			class="spaceman-1"
			style="transform: translateY({-y * 0.2}px) rotate(-{y * 0.03}deg)"
		/> -->
		<!-- particleSpace = follow Y but min 0.8 and max 10 -->
		<Spaceman particleSpace={1.2} />
	</div>
	<div class="flex flex-col gap-10">
		<h1
			class="z-10 w-full bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text font-sans text-5xl font-extrabold uppercase text-transparent md:text-7xl xl:w-3/4"
		>
			Sentinel, Content creator, gamer, degen
		</h1>

		<div class=" flex flex-col gap-4 md:w-2/3">
			<p class="z-10 text-lg leading-normal text-white/75 md:text-2xl">
				Passionate about crypto, I focus on advancing decentralization and privacy to reshape online
				identity, reputation, and trust.
			</p>

			<p class="z-10 text-lg leading-normal text-white/75 md:text-2xl">
				Through content creation, moderation, and community management, efforts center on raising
				awareness and promoting solutions tied to decentralized identity, Web3 gaming, and community
				building. The goal is to enhance transparency, strengthen reputation management, and empower
				users.
			</p>
		</div>
	</div>

	<div class="mt-20 flex flex-col gap-5">
		<h1
			class="w-full bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text font-sans text-5xl font-extrabold uppercase text-transparent md:text-7xl xl:w-3/4"
		>
			Socials
		</h1>

		<div class=" flex flex-row" style="margin-left:-20px">
			<ParticleIcon icon="x.svg" size={85} title="X" />
			<ParticleIcon icon="telegram.svg" size={85} title="Telegram" />
			<ParticleIcon icon="discord.svg" size={85} title="Discord" />
			<ParticleIcon icon="phaver.svg" size={85} title="Phaver" />
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<span class="text-sm text-white/75">Copyright © 2024 April Zoe. All rights reserved.</span>
		<span class="text-sm text-white/75">Developed by Apeinzoo & April Zoe</span>
	</div>
</div>

<!-- 
<div class="absolute bottom-40 left-0 flex w-full items-center justify-center">
	<a href="/about" class="open-sans-bold text-1xl text-white">Follow</a>
</div> -->

<style>
	.content-frame {
		margin-top: -100vh;
	}

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

	.spaceman-1 {
		width: 400px;
	}

	.spaceman-wrap {
		right: calc(55% - 50px);
	}
	.spaceman-3 {
		width: 150px;
	}
</style>
