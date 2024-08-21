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
