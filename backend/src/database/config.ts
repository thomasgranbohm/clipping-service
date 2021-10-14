import { SequelizeOptions } from 'sequelize-typescript';
import { DATABASE } from '../constants';

console.log(__dirname + '/models/*.ts');

export const DATABASE_CONFIG: SequelizeOptions = {
	dialect: 'postgres',
	host: DATABASE.HOST,
	port: DATABASE.PORT,
	database: DATABASE.NAME,
	username: DATABASE.USERNAME,
	password: DATABASE.PASSWORD,
	sync: { force: true },
	models: [__dirname + '/models/*.ts'],
};
