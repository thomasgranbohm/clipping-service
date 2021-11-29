import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { sign } from 'jsonwebtoken';
import { connectToDatabase, revalidate } from './database';
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

// Plex API
server.use('/clip', Clip);
server.use('/episode', Episode);
server.use('/library', Library);
server.use('/path', Path);
server.use(`/season`, Season);
server.use(`/show`, Show);
server.use('/webhook', Webhook);
server.use((err, _, res, __) => {
	console.error('Got error:', err);

	if ('status' in err) {
		res.status(parseInt(err.status));
	}
	return res.json(err);
});

server.post('/login', async (req, res) => {
	if ('password' in req.body === false)
		return res.status(401).send('Wrong password.');
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
	await connectToDatabase();
	if (process.env.NODE_ENV === 'production') {
		await revalidate();
	}
	server.listen(1337, async () => {
		console.log('Started!');
	});
};

main();
