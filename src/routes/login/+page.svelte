<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form';

	import Loader from 'lucide-svelte/icons/loader';

	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '@lib/schemas/valibot/loginSchema';

	let { data } = $props();
	const { hasAdmin } = data;

	const form = superForm(data.form, {
		validators: valibot(loginSchema)
	});
	const { form: formData, enhance, delayed } = form;
</script>

<form class="flex h-screen items-center justify-center" method="POST" use:enhance>
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">
				{#if hasAdmin}Login{:else}Create an Admin Account{/if}
			</Card.Title>
			<Card.Description>
				{#if hasAdmin}
					Enter your details below to login to your account.
				{:else}
					Enter your details below to create admin account.
				{/if}
			</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<Form.Field {form} name="username">
				<Form.Control let:attrs>
					<Form.Label>User</Form.Label>
					<Input {...attrs} bind:value={$formData.username} />
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label>Password</Form.Label>
					<Input {...attrs} type="password" bind:value={$formData.password} />
				</Form.Control>
			</Form.Field>
		</Card.Content>
		<Card.Footer>
			<Button type="submit" class="w-full">
				{#if $delayed}
					<Loader class="size-4 animate-spin" />
				{:else if hasAdmin}Sign in{:else}Create{/if}
			</Button>
		</Card.Footer>
	</Card.Root>
</form>
