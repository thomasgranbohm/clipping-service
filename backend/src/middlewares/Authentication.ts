import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

const Authentication = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.cookies || 'token' in req.cookies === false)
		return res.status(401).send('Not authorized');

	const { token } = req.cookies;

	try {
		await verify(token, process.env.PUBLIC_KEY, {
			algorithms: ['RS256'],
		});

		return next();
	} catch (error) {
		return res.status(401).send('Not authorized');
	}
};

export default Authentication;
