<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { formatCurrency, formatNumber } from '$lib/utils';

	type DashboardCardProps = {
		title: string;
		subtitle: string;
		body: string;
	};

	let { data } = $props();
	let { productData, salesData, userData } = $derived(data);
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
	{@render dashboardCard({
		title: 'Sales',
		subtitle: `${formatNumber(salesData.numberOfSales)} orders`,
		body: formatCurrency(salesData.amount)
	})}
	{@render dashboardCard({
		title: 'Customers',
		subtitle: `${formatCurrency(userData.averageValuePerUser)} Average Value`,
		body: formatNumber(userData.userCount)
	})}
	{@render dashboardCard({
		title: 'Sales',
		subtitle: `${formatNumber(productData.inactiveCount)} Inactive`,
		body: `${formatNumber(productData.active)} Active`
	})}
</div>

{#snippet dashboardCard({ title, subtitle, body }: DashboardCardProps)}
	<Card.Root>
		<Card.Header>
			<Card.Title>{title}</Card.Title>
			<Card.Description>{subtitle}</Card.Description>
		</Card.Header>
		<Card.Content>
			<p>{body}</p>
		</Card.Content>
	</Card.Root>
{/snippet}
