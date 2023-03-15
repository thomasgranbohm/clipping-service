import { NextApiHandler } from 'next';
import { privateAPI } from 'utils/api';

const Handler: NextApiHandler = async (req, res) => {
	console.log(req.headers, req.cookies);

	try {
		if ('token' in req.cookies !== true) {
			throw new Error();
		}

		await privateAPI.get('/verify', {
			headers: {
				cookie: Object.entries(req.cookies)
					.map(([key, value]) => `${key}=${value}`)
					.join(';'),
			},
		});

		return res.send('OK');
	} catch (error) {
		return res.status(401).send('Not OK');
	}
};

export default Handler;
