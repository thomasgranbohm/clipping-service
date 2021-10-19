import { SequelizeOptions } from 'sequelize-typescript';
import { DATABASE } from '../constants';
import { Clip } from './models/Clip';

export const DATABASE_CONFIG: SequelizeOptions = {
	dialect: 'postgres',
	host: DATABASE.HOST,
	port: DATABASE.PORT,
	database: DATABASE.NAME,
	username: DATABASE.USERNAME,
	password: DATABASE.PASSWORD,
	logging: process.env.NODE_ENV !== 'production' && console.debug,
	sync: { force: true },
	models: [Clip],
};
