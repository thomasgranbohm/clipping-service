import { createConnection } from 'typeorm';
import { TYPEORM_CONFIG } from './config';

export const connectToDatabase = () => createConnection(TYPEORM_CONFIG);
