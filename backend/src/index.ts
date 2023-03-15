import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { sign } from 'jsonwebtoken';
import { connectToDatabase, reinitialize } from './database';
import Authentication from './middlewares/Authentication';
import Clip from './routes/Clip';
import Episode from './routes/Episode';
import Library from './routes/Library';
import Path from './routes/Path';
import Season from './routes/Season';
import Show from './routes/Show';
import Webhook from './routes/Webhook';

const server = express();

server.use(
	cors({
		origin: [process.env.FRONTEND_URL],
		credentials: true,
	})
);
server.use(express.json());
server.use(cookieParser());

type CustomError = {
	status: number;
	message: string;
	stack?: string[];
	error?: unknown;
};

// Plex API
server.use('/clip', Clip);
server.use('/episode', Episode);
server.use('/library', Library);
server.use('/path', Path);
server.use('/season', Season);
server.use('/show', Show);
server.use('/webhook', Webhook);
server.use((err: CustomError, _, res, __) => {
	const { message, status, stack } = err;

	if (process.env.NODE_ENV !== 'production') {
		console.error(err.error);
	}

	return res.status(status || 500).json({
		message: message || 'Something went wrong.',
		stack:
			process.env.NODE_ENV !== 'production'
				? stack
				: 'Only available in development.',
	});
});

server.get('/health-check', (_, res) => res.send('Running.'));

server.post('/login', async (req, res) => {
	if ('password' in req.body === false) {
		return res.status(401).send('Wrong password.');
	}

	const { password } = req.body;

	if (password !== process.env.PASSWORD)
		return res.status(401).send('Wrong password.');

	const cookie = await sign({ logged_in: true }, process.env.PRIVATE_KEY, {
		algorithm: 'RS256',
		expiresIn: '1d',
	});

	return res.cookie('token', cookie).send('OK');
});

server.get('/verify', Authentication, async (_, res) => {
	res.status(200).send('OK');
});

const main = async () => {
	try {
		const connection = await connectToDatabase();

		if (process.env.NODE_ENV === 'production') {
			await connection.sync({ force: true });
			await reinitialize();
		}
		server.listen(1337, async () => {
			console.log('Started!');
		});
	} catch (error) {
		console.error('Something went wrong starting the project.');
		console.error(error);
	}
};

main();
