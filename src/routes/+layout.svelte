<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<main class="bg-background min-h-screen font-sans antialiased">
	{@render children()}
</main>
