<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { formatNumber } from '$lib/utils';

	type DashboardCardProps = {
		title: string;
		subtitle: string;
		body: string;
	};
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
	{@render dashboardCard({
		title: 'Sales',
		subtitle: `${formatNumber(2000)} orders`,
		body: '$1,000.00'
	})}
	{@render dashboardCard({
		title: 'Total Sales',
		subtitle: '',
		body: '$1,000.00'
	})}
	{@render dashboardCard({
		title: 'Total Sales',
		subtitle: 'This month',
		body: '$1,000.00'
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
