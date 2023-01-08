import { NextApiHandler } from 'next';
import { verify } from 'jsonwebtoken';
import { getCookieParser } from 'next/dist/server/api-utils';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

const Handler: NextApiHandler = async (req, res) => {
	const parseCookie = getCookieParser(req.headers);
	const cookies = parseCookie();

	try {
		if ('token' in cookies === false) throw new Error();

		await verify(cookies.token, serverRuntimeConfig.PUBLIC_KEY, {
			algorithms: ['RS256'],
		});

		return res.send('OK');
	} catch (error) {
		return res.status(401).send('Not OK');
	}
};

export default Handler;
