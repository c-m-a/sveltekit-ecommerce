import type { PageServerLoad } from '../$types';
import fs from 'fs/promises';

import { fail, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { partial } from 'valibot';

import { db } from '@/hooks.server';
import { redirect } from '@sveltejs/kit';

import { addProductSchema } from '@/lib/schemas/valibot/productSchema';
import { generateRandNumber, getCurrentDateTime, getFileExtension } from '@/lib/utils';

import { PRODUCT_FILE_PATH, PRODUCT_IMG_PATH } from '@/config/constants';

const defaultPath = PRODUCT_FILE_PATH;
const defaultImgPath = PRODUCT_IMG_PATH;

export const load = async ({ params: { id } }) => {
	const product = await db.product.findUnique({
		where: { id }
	});
	return {
		form: await superValidate(product, valibot(addProductSchema), { errors: false }),
		product
	};
};

export const actions = {
	default: async ({ request, params: { id } }) => {
		const form = await superValidate(
			request,
			valibot(partial(addProductSchema, ['file', 'image']))
		);
		if (!form.valid) return fail(400, { form });

		const product = await db.product.findUnique({ where: { id } });

		if (!product) return false;

		let fileName = product?.filePath;
		let fileNameExt = getFileExtension({ name: fileName });
		let imgFileName = product?.imagePath;
		let imgFileNameExt = getFileExtension({ name: imgFileName });

		if (form.data.file) {
			fileName = `${generateRandNumber()}_${getCurrentDateTime()}.${fileNameExt}`;
			const filePath = defaultPath + fileName;
			await fs.unlink(defaultPath + product.filePath);
			await fs.writeFile(filePath, Buffer.from(await form.data.file.arrayBuffer()));
		}

		if (form.data.image) {
			imgFileName = `${generateRandNumber()}_${getCurrentDateTime()}.${imgFileNameExt}`;
			const imagePath = defaultImgPath + imgFileName;
			await fs.unlink(defaultImgPath + product.imagePath);
			await fs.writeFile(imagePath, Buffer.from(await form.data.image.arrayBuffer()));
		}

		try {
			await db.product.update({
				where: { id },
				data: {
					name: form.data.name,
					description: form.data.description,
					price: form.data.price,
					filePath: fileName,
					imagePath: imgFileName
				}
			});
		} catch (e) {
			console.error(e);
		}

		redirect(303, '/admin/products');
	}
};
