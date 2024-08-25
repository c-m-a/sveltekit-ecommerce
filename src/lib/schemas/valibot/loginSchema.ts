import { object, minLength, pipe, string } from 'valibot';

export const loginSchema = object({
	username: pipe(string(), minLength(3, 'Please enter your username')),
	password: pipe(string(), minLength(6, 'Please enter your password'))
});
