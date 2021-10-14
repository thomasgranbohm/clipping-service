import { Sequelize } from 'sequelize-typescript';
import { DATABASE_CONFIG } from './config';

export const connectToDatabase = () => new Sequelize(DATABASE_CONFIG);
