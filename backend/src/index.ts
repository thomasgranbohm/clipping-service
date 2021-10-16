import cors from 'cors';
import express, { Response } from 'express';
import { connectToDatabase } from './database';
import Clip from './routes/Clip';
import Item from './routes/Item';
import Library from './routes/Library';

const server = express();

server.use(
	cors({
		origin: [process.env.FRONTEND_URL],
	})
);
server.use(express.json());

server.get('/', (_, res) => {
	res.send('Hello, World!');
});

server.use('/clips', Clip);

// Plex API
server.use('/libraries', Library);
server.use('/items', Item);

server.use((err, _, res: Response, __) => {
	console.log(err.stack);
	res.status(400).send(err.message);
});

server.listen(1337, async () => {
	const s = await connectToDatabase();
	console.log('Started!');
});
