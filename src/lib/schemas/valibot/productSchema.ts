import {
	object,
	minLength,
	pipe,
	string,
	number,
	toMinValue,
	file,
	maxSize,
	mimeType
} from 'valibot';
import { FILE_MAX_SIZE } from '../../../config/constants';

export const addProductSchema = object({
	name: pipe(string(), minLength(3, 'message')),
	price: pipe(number(), toMinValue(0)),
	description: pipe(string(), minLength(5)),
	file: pipe(
		file('Please select a file!'),
		maxSize(FILE_MAX_SIZE, 'Please select a file smaller than 10 MB!')
	),
	image: pipe(
		file('Please select a file'),
		mimeType(['image/jpeg', 'image/png'], 'Please select a JPEG or PNG file.'),
		maxSize(1024 * 1024 * 10, 'Please select a file smaller than 10 MB.')
	)
});
