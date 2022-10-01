import { NextApiHandler } from 'next';
import { privateAPI } from 'utils/api';

const Handler: NextApiHandler = async (req, res) => {
	const { data } = await privateAPI(req.url.replace(/^\/api/, ''));
	return res.send(data);
};

export default Handler;
