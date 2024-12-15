<script lang="ts">
	import { fade } from 'svelte/transition';
	import { config } from '$lib/stores/appStates.svelte';
	import ParticleIcon from '$lib/components/ParticleIcon.svelte';

	const scrollTo = (id: string) => {
		config.isHamburgerOpen = false;
		const element = document.getElementById(id);
		if (element) {
			const elementPosition = element.getBoundingClientRect().top + window.scrollY;
			const offsetPosition = elementPosition - 20;

			window.scrollTo({
				top: offsetPosition,
				behavior: 'smooth'
			});
		}
	};
</script>

<div class="header fixed items-center justify-between">
	<button
		class="hamburger hamburger--minus"
		class:is-active={config.isHamburgerOpen}
		type="button"
		tabindex="0"
		aria-label="Menu"
		on:click={() => (config.isHamburgerOpen = !config.isHamburgerOpen)}
	>
		<span class="hamburger-box">
			<span class="hamburger-inner"></span>
		</span>
	</button>
</div>

{#if config.isHamburgerOpen}
	<div
		transition:fade={{ duration: 300 }}
		class="headerMenu fixed flex h-full w-full flex-col gap-3 p-10"
	>
		<div class="hamburgerItems flex flex-col gap-2 ps-20 pt-10">
			<div
				class="w-full cursor-pointer bg-gradient-to-r from-white/90 to-white/100 bg-clip-text font-sans text-2xl font-extrabold uppercase text-transparent"
			>
				April Zoe
			</div>
			<span
				on:click={() => scrollTo('about')}
				on:keydown={(e) => e.key === 'Enter' && scrollTo('about')}
				class="w-full cursor-pointer bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text font-sans font-extrabold uppercase text-transparent"
				role="button"
				tabindex="0"
			>
				About
			</span>
			<span
				on:click={() => scrollTo('blog')}
				on:keydown={(e) => e.key === 'Enter' && scrollTo('about')}
				class="w-full cursor-pointer bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text font-sans font-extrabold uppercase text-transparent"
				role="button"
				tabindex="0"
			>
				Blog
			</span>
			<span
				on:click={() => scrollTo('development')}
				on:keydown={(e) => e.key === 'Enter' && scrollTo('development')}
				class="w-full cursor-pointer bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text font-sans font-extrabold uppercase text-transparent"
				role="button"
				tabindex="0">dApps</span
			>
		</div>
		<div class=" fixed bottom-10 flex flex-row ps-20" style="margin-left:-20px">
			<ParticleIcon icon="x.svg" size={100} title="X" link="https://x.com/April_Zoe_AZ" />
			<ParticleIcon icon="telegram.svg" size={100} title="Telegram" link="https://t.me/April_Zoe" />
			<ParticleIcon icon="discord.svg" size={100} title="Discord" clipboard="@aprilzoe8728" />
			<ParticleIcon
				icon="phaver.svg"
				size={100}
				title="Phaver"
				link="https://app.phaver.com/xi81E6kZNWToxyav5"
			/>
		</div>
	</div>
{/if}

<style>
	.header {
		z-index: 10;
	}

	.headerMenu {
		-webkit-backdrop-filter: blur(10px);
		backdrop-filter: blur(10px);
		background-color: #00000063;
		z-index: 9;
	}

	.hamburgerItems > span {
		font-size: 4.5rem;
		line-height: 1.1;
	}

	.hamburger {
		padding: 15px 15px;
		display: inline-block;
		cursor: pointer;
		transition-property: opacity, filter;
		transition-duration: 0.15s;
		transition-timing-function: linear;
		font: inherit;
		color: inherit;
		text-transform: none;
		background-color: transparent;
		border: 0;
		margin: 0;
		overflow: visible;
		transform: scale(0.6);
	}
	.hamburger:hover {
		opacity: 0.7;
	}
	.hamburger.is-active:hover {
		opacity: 0.7;
	}
	.hamburger.is-active .hamburger-inner,
	.hamburger.is-active .hamburger-inner::before,
	.hamburger.is-active .hamburger-inner::after {
		background-color: #fff;
	}

	.hamburger-box {
		width: 40px;
		height: 24px;
		display: inline-block;
		position: relative;
	}

	.hamburger-inner {
		display: block;
		top: 50%;
		margin-top: -2px;
	}
	.hamburger-inner,
	.hamburger-inner::before,
	.hamburger-inner::after {
		width: 40px;
		height: 4px;
		-webkit-backdrop-filter: blur(84px);
		backdrop-filter: blur(84px);
		background-color: #ffffffbd;
		border-radius: 4px;
		position: absolute;
		transition-property: transform;
		transition-duration: 0.15s;
		transition-timing-function: ease;
	}
	.hamburger-inner::before,
	.hamburger-inner::after {
		content: '';
		display: block;
	}
	.hamburger-inner::before {
		top: -10px;
	}
	.hamburger-inner::after {
		bottom: -10px;
	}

	/*
   * Minus
   */
	.hamburger--minus .hamburger-inner::before,
	.hamburger--minus .hamburger-inner::after {
		transition:
			bottom 0.08s 0s ease-out,
			top 0.08s 0s ease-out,
			opacity 0s linear;
	}

	.hamburger--minus.is-active .hamburger-inner::before,
	.hamburger--minus.is-active .hamburger-inner::after {
		opacity: 0;
		transition:
			bottom 0.08s ease-out,
			top 0.08s ease-out,
			opacity 0s 0.08s linear;
	}

	.hamburger--minus.is-active .hamburger-inner::before {
		top: 0;
	}

	.hamburger--minus.is-active .hamburger-inner::after {
		bottom: 0;
	}
</style>
