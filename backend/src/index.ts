import cors from 'cors';
import express, { Response } from 'express';
import { readFileSync } from 'fs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from './database';
import Clip from './routes/Clip';
import Item from './routes/Item';
import Library from './routes/Library';

console.log(process.cwd());

const server = express();

server.use(
	cors({
		origin: [process.env.FRONTEND_URL],
	})
);
server.use(express.json());

server.use((err, _, res: Response, __) => {
	console.log('Got error:', err.stack);
	res.status(400).send(err.message);
});

server.get('/', (_, res) => {
	res.send('Hello, World!');
});

server.use('/clips', Clip);

// Plex API
server.use('/libraries', Library);
server.use('/items', Item);

server.post('/login', async (req, res) => {
	if ('password' in req.body === false)
		return res.status(401).send('No password provided.');
	const { password } = req.body;

	if (password !== process.env.PASSWORD)
		return res.status(400).send('Wrong password.');

	const cookie = await jwt.sign({ logged_in: true }, process.env.PRIVATE_KEY, {
		algorithm: 'RS256',
		expiresIn: '1d',
	});

	return res.cookie('token', cookie).send('OK');
});

server.listen(1337, async () => {
	const s = await connectToDatabase();
	// await s.sync({ force: true });
	console.log('Started!');
});
