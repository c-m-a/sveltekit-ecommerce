<script lang="ts">
	import * as Table from '@/lib/components/ui/table';
	import * as DropdownMenu from '@lib/components/ui/dropdown-menu';

	import { MoreVertical } from 'lucide-svelte';
	import PageHeader from '@/lib/components/PageHeader.svelte';
	import { formatCurrency } from '@/lib/utils';

	let { data } = $props();
</script>

<PageHeader>Orders</PageHeader>

{#if data.orders.length === 0}
	<p>No sales found.</p>
{:else}
	{@render userTable()}
{/if}

{#snippet userTable()}
	<section>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-0">Product</Table.Head>
					<Table.Head>Customer</Table.Head>
					<Table.Head>Price Paid</Table.Head>
					<Table.Head class="w-0 text-right">
						<span class="sr-only">Actions</span>
					</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.orders as order}
					<Table.Row>
						<Table.Cell class="font-medium">{order.product}</Table.Cell>
						<Table.Cell>{order.user.email}</Table.Cell>
						<Table.Cell>{formatCurrency(order.price)}</Table.Cell>
						<Table.Cell class="text-right">
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<MoreVertical />
									<span class="sr-only">Action</span>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content class="space-y-1">
									<form action="?/deleteOrder" method="POST" use:enhance>
										<input type="hidden" name="id" value={order.id} />
										<button
											type="submit"
											class="m-.5 w-full rounded p-1.5 text-left text-destructive hover:bg-gray-100"
											>Delete</button
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
