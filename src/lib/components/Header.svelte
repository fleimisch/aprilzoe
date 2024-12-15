<script lang="ts">
	import { fade } from 'svelte/transition';
	import { config } from '$lib/stores/appStates.svelte';
	import ParticleIcon from '$lib/components/ParticleIcon.svelte';
	import { device } from '$lib/stores/device';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Spaceman from '$lib/components/Spaceman.svelte';

	const scrollTo = (id: string) => {
		const _page = $page;

		if (_page.url.pathname !== '/') {
			goto('/');
		}

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
		<div class="flex flex-col gap-10" class:ps-20={$device.isDesktop}>
			<div
				class="flex w-full cursor-pointer flex-row items-center gap-3 bg-gradient-to-r from-white/90 to-white/100 bg-clip-text pt-10 font-sans text-2xl font-extrabold uppercase text-transparent"
			>
				<img src="/aprilzoe.png" width={45} class="rounded-full" />
				April Zoe
			</div>
			<div class="hamburgerItems flex flex-col gap-3 pt-1">
				<span
					on:click={() => {
						goto('/#about');
						config.isHamburgerOpen = false;
					}}
					on:keydown={(e) =>
						e.key === 'Enter' &&
						(() => {
							goto('/#about');
							config.isHamburgerOpen = false;
						})()}
					class="w-full cursor-pointer font-sans font-extrabold uppercase text-transparent"
					role="button"
					tabindex="0"
				>
					About
				</span>
				<span
					on:click={() => {
						config.isHamburgerOpen = false;
						goto('/blog');
					}}
					on:keydown={() => {
						config.isHamburgerOpen = false;
						goto('/blog');
					}}
					class="w-full cursor-pointer font-sans font-extrabold uppercase text-transparent"
					role="button"
					tabindex="0"
				>
					Blog
				</span>
				<span
					on:click={() => {
						goto('/#dapps');
						config.isHamburgerOpen = false;
					}}
					on:keydown={(e) =>
						e.key === 'Enter' &&
						(() => {
							goto('/#dapps');
							config.isHamburgerOpen = false;
						})()}
					class="w-full cursor-pointer font-sans font-extrabold uppercase text-transparent"
					role="button"
					tabindex="0">dApps</span
				>
			</div>
			<div class=" fixed bottom-10 flex flex-col">
				<span class="font-sans font-bold uppercase text-white/50">Socials</span>
				<div class="flex flex-row" style="margin-left:-20px">
					<ParticleIcon icon="x.svg" size={100} title="X" link="https://x.com/April_Zoe_AZ" />
					<ParticleIcon
						icon="telegram.svg"
						size={100}
						title="Telegram"
						link="https://t.me/April_Zoe"
					/>
					<ParticleIcon icon="discord.svg" size={100} title="Discord" clipboard="@aprilzoe8728" />
					<ParticleIcon
						icon="phaver.svg"
						size={100}
						title="Phaver"
						link="https://app.phaver.com/xi81E6kZNWToxyav5"
					/>
				</div>
			</div>
		</div>
		<div class="spaceman-wrap fixed">
			<Spaceman particleSpace={1.1} />
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

	.headerMenu:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 80%;
		height: 80%;
		background-image: linear-gradient(99deg, rgb(255, 35, 193), rgb(129, 47, 253));
		border-radius: 1000px;
		filter: blur(200px);
		z-index: 0;
		user-select: none !important;
		pointer-events: none !important;
		opacity: 0.15;
	}

	.hamburgerItems > span {
		font-size: 4.5rem;
		line-height: 1.1;
		color: #170622;
		text-shadow: 0px -1px 0px #ff6dc5;
		transition: background-image 0.3s ease;
	}

	.spaceman-wrap {
		width: 50%;
		height: 100%;
		right: 0;
	}
	:global(.spaceman-wrap *) {
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

	@media (min-width: 1024px) {
		.hamburgerItems > span:hover {
			background-image: linear-gradient(99deg, rgb(255, 35, 193), rgb(129, 47, 253));
			background-clip: text;
			-webkit-background-clip: text;
			color: transparent; /* Ensure text color is transparent */
			-webkit-text-fill-color: transparent; /* Ensure text fill is transparent */
		}
	}

	@media (max-width: 1024px) {
		.headerMenu:before {
			width: 100%;
			height: 80%;
			opacity: 0.3;
			left: -10%;
		}
	}
</style>
