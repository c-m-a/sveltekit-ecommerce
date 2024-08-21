import type { PageServerLoad } from '../$types';
import fs from 'fs/promises';

import { fail, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

import { addProductSchema } from '@/lib/schemas/valibot/productSchema';
import { db } from '@/hooks.server';
import { redirect } from '@sveltejs/kit';
import { generateRandNumber, getCurrentDateTime, getFileExtension } from '@/lib/utils';
import { PRODUCT_FILE_PATH, PRODUCT_IMG_PATH } from '@/config/constants';

const defaultPath = PRODUCT_FILE_PATH;
const defaultImgPath = PRODUCT_IMG_PATH;

export const load = (async () => {
	return { form: await superValidate(valibot(addProductSchema)) };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, valibot(addProductSchema));
		const fileNameExt = getFileExtension(form.data.file);
		const imgFileNameExt = getFileExtension(form.data.image);
		const fileName = `${generateRandNumber()}_${getCurrentDateTime()}.${fileNameExt}`;
		const imgFileName = `${generateRandNumber()}_${getCurrentDateTime()}.${imgFileNameExt}`;

		if (!form.valid) return fail(400, { form });

		await fs.mkdir(defaultPath, { recursive: true });
		const filePath = `${defaultPath}${fileName}`;
		await fs.writeFile(filePath, Buffer.from(await form.data.file.arrayBuffer()));
		const imagePath = `${defaultImgPath}${imgFileName}`;
		console.log('imagePath', imagePath);
		await fs.mkdir(defaultImgPath, { recursive: true });
		await fs.writeFile(imagePath, Buffer.from(await form.data.image.arrayBuffer()));

		try {
			await db.product.create({
				data: {
					name: form.data.name,
					description: form.data.description,
					price: form.data.price,
					filePath: fileName,
					imagePath: imgFileName,
					isAvailableForPurchase: false
				}
			});
		} catch (e) {
			console.log(e);
		}

		redirect(303, '/admin/products');
	}
};
