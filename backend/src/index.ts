import cors from 'cors';
import express, { Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { connectToDatabase, syncAll } from './database';
import Clip from './routes/Clip';
import Item from './routes/Item';
import Library from './routes/Library';

const server = express();

server.use(
	cors({
		origin: [process.env.FRONTEND_URL],
		credentials: true,
	})
);
server.use(express.json());
server.use(cookieParser());

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

	const cookie = await sign({ logged_in: true }, process.env.PRIVATE_KEY, {
		algorithm: 'RS256',
		expiresIn: '1d',
	});

	return res.cookie('token', cookie).send('OK');
});

server.get('/verify', async (req, res) => {
	if (!req.cookies || 'token' in req.cookies === false)
		return res.status(401).send('No token provided.');

	const { token } = req.cookies;

	try {
		await verify(token, process.env.PUBLIC_KEY, {
			algorithms: ['RS256'],
		});

		res.status(200).send('OK');
	} catch (error) {
		res.status(401).send('Not authorized');
	}
});

server.listen(1337, async () => {
	const s = await connectToDatabase();
	if (process.env.NODE_ENV === 'production') {
		await s.sync({ force: true });
		await syncAll();
	}
	console.log('Started!');
});
