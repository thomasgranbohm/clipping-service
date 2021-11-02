import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { sign, verify } from 'jsonwebtoken';
import { connectToDatabase, syncAll } from './database';
import Clip from './routes/Clip';
import Episode from './routes/Episode';
import Library from './routes/Library';
import Path from './routes/Path';
import Season from './routes/Season';
import Show from './routes/Show';

const server = express();

server.use(
	cors({
		origin: [process.env.FRONTEND_URL],
		credentials: true,
	})
);
server.use(express.json());
server.use(cookieParser());

server.get('/', (_, res) => {
	res.send('Hello, World!');
});

server.use('/clips', Clip);

// Plex API
server.use('/episodes', Episode);
server.use('/libraries', Library);
server.use('/paths', Path);
server.use('/seasons', Season);
server.use('/shows', Show);

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
