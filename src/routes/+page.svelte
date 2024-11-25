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

<div
	class="content-frame container relative mx-auto mb-20 flex flex-col gap-10 overflow-hidden px-6 md:overflow-visible md:px-20"
>
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
	<div class="mb-20 flex flex-col gap-10">
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

	<div class="relative z-10 mt-20 flex flex-col gap-10">
		<h2
			class="w-full font-sans text-5xl font-extrabold uppercase text-transparent text-white md:text-5xl xl:w-3/4"
		>
			Gigs
		</h2>

		<div class="flex flex-col gap-10 md:flex-row">
			<div class="flex flex-col gap-10 xl:flex-row">
				<div class="animated-border flex flex-1 flex-col items-start gap-7 bg-white/10 p-10">
					<div
						class="flex w-full flex-1 flex-row items-center justify-between gap-2"
						style="height:60px; max-height:60px; min-height:60px;"
					>
						<img src="/galactica-white.svg" class="h-10" />
						<p class="text-white/05 hidden text-sm xl:block">Jun 2024 - present</p>
					</div>
					<p
						class="text-lg leading-normal text-white md:text-2xl"
						style="max-height: 60px; height:60px; min-height:60px;"
					>
						Galactica Network Advocate | Sentinel | Cypher University Faction Leader
					</p>

					<div class="flex flex-col gap-4 text-lg text-white/75">
						<p>
							As a Sentinel, I serve as an ambassador, educator, and early adopter of the Galactica
							Network, actively promoting and supporting decentralized technology. Alongside this
							role, I am a Discord moderator, investor, node operator, and Cypher University Faction
							Leader, where I lead community management and business initiatives and drive awareness
							of decentralized protocols.
						</p>
						<p>
							Additionally, I collaborate closely with Galactica's core team to enhance the
							project's visibility, engage the community, and retain high-value members by providing
							meaningful opportunities and fostering strong connections and detecting potential
							synergies between partners.
						</p>
						<p>
							<a
								href="https://galactica.com/sentinels"
								class="bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text font-sans text-base font-bold text-transparent hover:from-pink-500 hover:to-violet-500"
								target="_blank">Galactica Network Sentinels</a
							>
						</p>
					</div>
				</div>

				<div class="animated-border flex flex-1 flex-col items-start gap-7 bg-white/10 p-10">
					<div
						class="flex w-full flex-1 flex-row items-center justify-between gap-2"
						style="height:60px; max-height:60px; min-height:60px;"
					>
						<div class="flex flex-row items-center justify-center gap-5">
							<img src="/xborg.svg" class="h-10" />
							<img src="/swissborg.svg" class="h-7" />
						</div>
						<!-- <p class="text-white/05 text-sm">Since Jan 2022</p> -->
					</div>
					<p
						class="text-lg leading-normal text-white md:text-2xl"
						style="max-height: 60px; height:60px; min-height:60px;"
					>
						Content creator for XBorg, SwissBorg, Social Rising, and more
					</p>

					<div class="flex flex-col gap-4 text-lg text-white/75">
						<p>
							I create engaging, high-value content including in-depth threads, memes, videos,
							trading analysis and occasionally host giveaways. I also share exclusive alpha from
							gated NFT communities, providing actionable insights and fostering informed
							decision-making for my audience.
						</p>
						<p>
							Through these efforts, I simplify complex topics, amplify community narratives, and
							bridge the gap between Web3 technologies and a broader audience, while staying attuned
							to the latest trends in blockchain, gaming, and decentralized finance.
						</p>
						<p class="mt-10 block">None of my content is financial advice.</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-20 flex flex-col gap-2">
		<h2
			class="w-full font-sans text-5xl font-extrabold uppercase text-transparent text-white md:text-5xl xl:w-3/4"
		>
			Development
		</h2>
		<h3 class=" font-sans text-2xl font-extrabold uppercase text-white">
			In collaboration with Apeinzoo
		</h3>

		<div class="mt-10 flex flex-col gap-10 md:flex-row">adasds</div>
	</div>

	<div class="mt-20 flex flex-col gap-5">
		<!-- <h1
			class="w-full bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text font-sans text-5xl font-extrabold uppercase text-transparent md:text-7xl xl:w-3/4"
		>
			Socials
		</h1> -->

		<div class=" flex flex-row" style="margin-left:-20px">
			<ParticleIcon icon="x.svg" size={100} title="X" link="https://x.com/April_Zoe_AZ" />
			<ParticleIcon icon="telegram.svg" size={100} title="Telegram" link="https://t.me/April_Zoe" />
			<ParticleIcon icon="discord.svg" size={100} title="Discord @aprilzoe8728" />
			<ParticleIcon
				icon="phaver.svg"
				size={100}
				title="Phaver"
				link="https://app.phaver.com/xi81E6kZNWToxyav5"
			/>
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<span class="text-sm text-white/75">Copyright © 2024 April Zoe. All rights reserved.</span>
		<span class="text-sm text-white/75"
			>Designed & Developed by <a
				class="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text font-sans font-extrabold uppercase text-transparent"
				href="https://x.com/apeinzoo"
				target="_blank">Apeinzoo</a
			></span
		>
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

	.spaceman-wrap {
		right: calc(50% - 50px);
		z-index: 2;
	}

	.animated-border {
		position: relative;
		border-radius: 1px;
		overflow: hidden;
	}

	.animated-border * {
		z-index: 2;
	}
	.animated-border::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 200%;
		z-index: 1;
		height: 200%;
		background: linear-gradient(
			115deg,
			transparent,
			transparent,
			rgba(255, 255, 255, 0.082),
			transparent,
			transparent
		);
		transform: translate(-100%, -100%);
		animation: shine 14s alternate infinite;
	}

	@keyframes shine {
		0% {
			transform: translate(-100%, -100%);
		}
		100% {
			transform: translate(0%, 0%);
		}
	}

	/* Optional: Add a subtle permanent border */
	.animated-border {
		border: 1px solid rgba(255, 255, 255, 0.2);
	}
</style>
