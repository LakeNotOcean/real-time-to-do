import { config } from 'dotenv';
import { join } from 'path';

const env = process.env.NODE_ENV;
if (!env) {
	console.log(process.env);
	throw Error('NODE_ENV is undefined');
}

const CONFIG_FILENAME = `${env}.env`;

export const generalConfig = () => {
	const path = join(__dirname, '..', '..', '..', 'env', CONFIG_FILENAME);
	const result = config({
		path: path,
	});
	console.log('env: ', env);
	result.parsed ??= {};
	result.parsed['env'] = env;
	return result;
};
