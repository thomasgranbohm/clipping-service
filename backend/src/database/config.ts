import { SequelizeOptions } from 'sequelize-typescript';
import { DATABASE } from '../constants';
import { Clip } from './models/Clip';
import { Episode } from './models/Episode';
import { Library } from './models/Library';
import { Season } from './models/Season';
import { Show } from './models/Show';

export const DATABASE_CONFIG: SequelizeOptions = {
	dialect: 'postgres',
	host: DATABASE.HOST,
	port: DATABASE.PORT,
	database: DATABASE.NAME,
	username: DATABASE.USERNAME,
	password: DATABASE.PASSWORD,
	logging: false,
	// logging: process.env.NODE_ENV !== 'production' && console.debug,
	sync: { force: true },
	models: [Library, Show, Season, Episode, Clip],
};
