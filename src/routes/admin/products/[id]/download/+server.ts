import fs from 'fs/promises';

import { db } from '@/hooks.server';
import { PRODUCT_FILE_PATH } from '@/config/constants';

export const GET = async ({ params: { id } }) => {
	const product = await db.product.findUnique({
		where: { id },
		select: { filePath: true, name: true }
	});

	if (!product) return new Response('product does not exist');

	const absFilePath = `${PRODUCT_FILE_PATH}${product.filePath}`;
	const { size } = await fs.stat(absFilePath);
	const file = await fs.readFile(absFilePath);
	const fileExt = product.filePath.split('.').pop();

	return new Response(file, {
		headers: {
			'Content-Type': `application/${fileExt}`,
			'Content-Length': size.toString(),
			'Content-Disposition': `attachment; filename=${product.filePath}`
		}
	});
};
