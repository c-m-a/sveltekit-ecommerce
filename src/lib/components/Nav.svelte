<script lang="ts">
	import type { Snippet } from 'svelte';

	type Navtype = {
		children: Snippet;
	};

	let { children }: Navtype = $props();
</script>

<nav class="flex items-center justify-center bg-primary px-4 text-primary-foreground">
	{@render children()}
</nav>
