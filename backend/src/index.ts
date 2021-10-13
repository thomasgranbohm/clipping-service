import express, { Response } from 'express';
import { scanMedia } from './services/FileReader';
import { connectToDatabase } from './database';
import Show from './routes/Show';

const server = express();

export let media = {};

server.use(express.json());

server.get('/', (_, res) => {
	res.send('Hello, World!');
});

server.use('/shows', Show);

server.use((err, _, res: Response, __) => {
	// console.log(err.stack);
	res.status(400).send(err.message);
});

server.listen(1337, async () => {
	await connectToDatabase();
	await scanMedia();
	console.log('http://localhost:1337');
});
