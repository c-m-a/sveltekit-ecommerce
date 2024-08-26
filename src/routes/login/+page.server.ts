import { loginSchema } from '@lib/schemas/valibot/loginSchema';
import { generateIdFromEntropySize } from 'lucia';
import { fail, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { db, lucia } from '../../hooks.server';
import { hash } from '@node-rs/argon2';
import { Argon2id } from 'oslo/password';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	const admin = await db.user.findFirst({ where: { isAdmin: true } });
	return {
		form: await superValidate(valibot(loginSchema)),
		hasAdmin: !!admin
	};
};

export const actions = {
	default: async (e) => {
		const redirectTo = e.url.searchParams.get('redirectTo');
		const form = await superValidate(e, valibot(loginSchema));

		if (!form.valid) return fail(400, { form });

		const username = form.data.username;
		const password = form.data.password;
		const admin = await db.user.findFirst({ where: { isAdmin: true } });
		const hasAdmin = !!admin;

		const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		const userId = generateIdFromEntropySize(10); // 16 characters long

		if (!hasAdmin) {
			await db.user.create({
				data: {
					id: userId,
					email: 'admin@email.com',
					passwordHash,
					username,
					isAdmin: true
				}
			});

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			e.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});

			if (redirectTo) {
				throw redirect(302, `/${redirectTo.slice(1)}`);
			}
			throw redirect(302, '/admin');
		}

		const existingUser = await db.user.findUnique({
			where: { username: form.data.username.toLowerCase() }
		});

		if (!existingUser) return;

		const passwordValid = await new Argon2id().verify(
			existingUser.passwordHash!,
			form.data.password
		);

		if (!passwordValid) return;

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		e.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		if (redirectTo) {
			throw redirect(302, `/${redirectTo.slice(1)}`);
		}
		throw redirect(302, '/admin');
	}
};
