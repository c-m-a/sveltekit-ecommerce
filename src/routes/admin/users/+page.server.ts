import { db } from '@/hooks.server';

export const load = async () => {
	return {
		users: await db.user.findMany({
			select: {
				id: true,
				email: true,
				Order: { select: { price: true } }
			},
			orderBy: { createdAt: 'desc' }
		})
	};
};

export const actions = {
	deleteUser: async ({ request }) => {
		const formData = await request.formatData();
		const id = formData.get('id') as string;
		await db.user.delete({ where: { id } });
	}
};
