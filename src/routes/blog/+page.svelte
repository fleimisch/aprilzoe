<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Blog Posts</h1>

<ul>
	{#each data.posts as post}
		<li>
			<a href="/blog/{post.slug}">
				<h2>{post.title}</h2>
				<p>{post.description}</p>
				<time datetime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
			</a>
		</li>
	{/each}
</ul>

<style>
	ul {
		list-style: none;
		padding: 0;
	}

	li {
		margin-bottom: 2rem;
	}

	a {
		text-decoration: none;
		color: inherit;
	}

	a:hover h2 {
		text-decoration: underline;
	}
</style>
