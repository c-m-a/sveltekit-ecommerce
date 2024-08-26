<script lang="ts">
	import type { Snippet } from 'svelte';

	type PageHeaderType = {
		children: Snippet;
	};
	let { children }: PageHeaderType = $props();
</script>

<h2 class="mb-4 text-4xl">
	{@render children()}
</h2>
