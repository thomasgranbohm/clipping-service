import { DATABASE } from '../constants';
import { ConnectionOptions } from 'typeorm';
import { resolve } from 'path';

export const TYPEORM_CONFIG: ConnectionOptions = {
	type: 'postgres',
	host: DATABASE.HOST,
	port: DATABASE.PORT,
	database: DATABASE.NAME,
	username: DATABASE.USERNAME,
	password: DATABASE.PASSWORD,
	logging: DATABASE.LOGGING,
	synchronize: true,
	entities: [resolve(__dirname, './entities/**/*.ts')],
};
