import { handleLoginRedirect } from '@lib/utils';
import { redirect } from '@sveltejs/kit';

export const load = async (e) => {
	if (!e.locals.user) {
		// redirect the path user requested
		const fromUrl = e.url.pathname + e.url.search;
		throw redirect(302, handleLoginRedirect(e));
	}
};
