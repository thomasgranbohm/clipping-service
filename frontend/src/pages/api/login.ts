import { NextApiHandler } from 'next';
import { privateAPI } from 'utils/api';

const Handler: NextApiHandler = async (req, res) => {
	try {
		const { data, headers } = await privateAPI.post('/login', req.body);

		return res.setHeader('set-cookie', headers['set-cookie']).json(data);
	} catch (error) {
		return res.status(401).send('Nope');
	}
};

export default Handler;
