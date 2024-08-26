<script lang="ts">
	import * as Table from '@/lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	import { CheckCircle, MoreVertical, XCircle } from 'lucide-svelte';
	import PageHeader from '@/lib/components/PageHeader.svelte';
	import { formatCurrency, formatNumber } from '@/lib/utils';

	let { data } = $props();
</script>

<PageHeader>Customers</PageHeader>

{#if data.users.length === 0}
	<p>No customer found.</p>
{:else}
	{@render userTable()}
{/if}

{#snippet userTable()}
	<section>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-0">Email</Table.Head>
					<Table.Head>Orders</Table.Head>
					<Table.Head>Value</Table.Head>
					<Table.Head class="w-0 text-right">
						<span class="sr-only">Actions</span>
					</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.users as user}
					<Table.Row>
						<Table.Cell class="font-medium">{user.email}</Table.Cell>
						<Table.Cell>{formatNumber(user.Order.length)}</Table.Cell>
						<Table.Cell
							>{formatCurrency(user.Order.reduce((sum, o) => o.price + sum, 0))}</Table.Cell
						>
						<Table.Cell class="text-right">
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<MoreVertical />
									<span class="sr-only">Action</span>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content class="space-y-1">
									<form action="?/deleteUser" method="POST" use:enhance>
										<input type="hidden" name="id" value={user.id} />
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
