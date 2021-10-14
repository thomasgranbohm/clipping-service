import express, { Response } from 'express';
import { connectToDatabase } from './database';
import Clip from './routes/Clip';
import Episode from './routes/Episode';
import Season from './routes/Season';
import Show from './routes/Show';
import { getAllLibraries } from './services/PlexAPI';
import Library from './routes/Library';
import Item from './routes/Item';

const server = express();

export let media = {};

server.use(express.json());

server.get('/', (_, res) => {
	res.send('Hello, World!');
});

server.use('/clips', Clip);
server.use('/episodes', Episode);
server.use('/seasons', Season);
server.use('/shows', Show);

// Plex API
server.use('/libraries', Library);
server.use('/items', Item);

server.use((err, _, res: Response, __) => {
	console.log(err.stack);
	res.status(400).send(err.message);
});

server.listen(1337, async () => {
	const s = await connectToDatabase();
	await s.sync({ force: true });
	console.log('Started!');
});
