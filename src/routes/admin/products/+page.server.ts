import fs from 'fs/promises';

import { db } from '@/hooks.server';
import type { PageServerLoad } from './$types';
import { PRODUCT_FILE_PATH, PRODUCT_IMG_PATH } from '@/config/constants';

const defaultPath = PRODUCT_FILE_PATH;
const defaultImgPath = PRODUCT_IMG_PATH;

export const load = (async () => {
	return {
		products: await db.product.findMany({
			select: {
				id: true,
				name: true,
				price: true,
				isAvailableForPurchase: true,
				imagePath: true,
				_count: {
					select: {
						Order: true
					}
				}
			},
			orderBy: {
				name: 'asc'
			}
		})
	};
}) satisfies PageServerLoad;

export const actions = {
	toggleAvailability: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const isAvailableForPurchase = formData.has('isAvailableForPurchase');

		await db.product.update({
			where: { id },
			data: {
				isAvailableForPurchase
			}
		});
	},

	deleteProduct: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const product = await db.product.findUnique({
			where: { id },
			select: { _count: { select: { Order: true } } }
		});

		const productHasOrders = product && product._count.Order > 0;

		if (productHasOrders) return;

		const deleteProduct = await db.product.delete({
			where: { id }
		});

		console.log('defaultPath', defaultPath);
		console.log('defaultImgPath', defaultImgPath);

		await fs.unlink(`${defaultPath}/${deleteProduct.filePath}`);
		await fs.unlink(`${defaultImgPath}${deleteProduct.imagePath}`);
	}
};
