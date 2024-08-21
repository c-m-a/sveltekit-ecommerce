<script lang="ts">
	import { Input } from '@/lib/components/ui/input';
	import * as Form from '@/lib/components/ui/form';
	import { Textarea } from '@/lib/components/ui/textarea';

	import { fileProxy, superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';

	import PageHeader from '@/lib/components/ui/PageHeader.svelte';

	import { addProductSchema } from '@/lib/schemas/valibot/productSchema.js';
	import { Loader } from 'lucide-svelte';
	import { Button } from '@/lib/components/ui/button';

	let { data } = $props();
	let form = superForm(data.form, {
		validators: valibotClient(addProductSchema)
	});

	let { form: formData, enhance, delayed } = form;
	let image = fileProxy(formData, 'image');
	let file = fileProxy(formData, 'file');
</script>

<PageHeader>Add Product</PageHeader>

<form
	method="POST"
	class="space-y-4"
	action="/admin/products/new"
	enctype="multipart/form-data"
	use:enhance
>
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} class="flex-1" name="price">
		<Form.Control let:attrs>
			<Form.Label>Price</Form.Label>
			<Input {...attrs} type="number" step="0.01" bind:value={$formData.price} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} class="flex-1" name="description">
		<Form.Control let:attrs>
			<Form.Label>Description</Form.Label>
			<Textarea {...attrs} bind:value={$formData.description} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} class="flex-1" name="file">
		<Form.Control let:attrs>
			<Form.Label>File</Form.Label>
			<input {...attrs} type="file" bind:files={$file} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} class="flex-1" name="image">
		<Form.Control let:attrs>
			<Form.Label>Image</Form.Label>
			<input {...attrs} accept="image/*" type="file" bind:files={$image} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Button type="submit">
		{#if $delayed}<Loader class="size-4 animate-spin" />{:else}Save{/if}
	</Button>
</form>
