<script lang="ts">
	import { Button } from '@/lib/components/ui/button';
	import * as Table from '@/lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	import { CheckCircle, MoreVertical, XCircle } from 'lucide-svelte';
	import PageHeader from '@/lib/components/PageHeader.svelte';
	import { formatCurrency, formatNumber } from '@/lib/utils';

	let { data } = $props();
</script>

<section class="flex items-center justify-between gap-4">
	<PageHeader>Products</PageHeader>
	<Button href="/admin/products/new">Add product</Button>
</section>

{#if data.products.length === 0}
	<p>No product found.</p>
{:else}
	{@render productTable()}
{/if}

{#snippet productTable()}
	<section>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-0">
						<span class="sr-only">Available for purchase</span>
					</Table.Head>
					<Table.Head>Name</Table.Head>
					<Table.Head>Price</Table.Head>
					<Table.Head>Order</Table.Head>
					<Table.Head class="w-0">
						<span class="sr-only">Actions</span>
					</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.products as product}
					<Table.Row>
						<Table.Cell class="font-medium">
							{#if product.isAvailableForPurchase}
								<span class="sr-only">Available</span>
								<CheckCircle />
							{:else}
								<span class="sr-only">Unavailable</span>
								<XCircle />
							{/if}
						</Table.Cell>
						<Table.Cell>{product.name}</Table.Cell>
						<Table.Cell>{formatCurrency(product.price)}</Table.Cell>
						<Table.Cell>{formatNumber(product._count.Order)}</Table.Cell>
						<Table.Cell class="text-right">
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<MoreVertical />
									<span class="sr-only">Action</span>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content class="space-y-1">
									<DropdownMenu.Item
										href="/admin/products/{product.id}/download"
										class="cursor-pointer"
										download>Download</DropdownMenu.Item
									>
									<DropdownMenu.Item href="/admin/products/{product.id}/edit" class="cursor-pointer"
										>Edit</DropdownMenu.Item
									>
									<form action="?/toggleAvailability" method="POST" use:enhance>
										<input type="hidden" name="id" value={product.id} />
										<input
											type="checkbox"
											name="isAvailableForPurchase"
											class="hidden"
											checked={!product.isAvailableForPurchase}
										/>
										<button
											type="submit"
											class="m-.5 w-full rounded p-1.5 text-left hover:bg-gray-100"
										>
											{#if product.isAvailableForPurchase}Deactive{:else}Activate{/if}
										</button>
									</form>
									<form action="?/deleteProduct" method="POST" use:enhance>
										<input type="hidden" name="id" value={product.id} />
										<button
											type="submit"
											class="m-.5 w-full rounded p-1.5 text-left text-destructive hover:bg-gray-100"
											disabled={product._count.Order > 0}>Delete</button
										>
									</form>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</section>
{/snippet}
