import { NextFunction, Request, Response } from 'express';

const DatabaseLimit = (req: Request, _: Response, next: NextFunction) => {
	let limit = parseInt(req.query.limit as string);
	if (Number.isNaN(limit) || limit < 0 || limit > 100) limit = 10;
	req.limit = limit;

	let offset = parseInt(req.query.offset as string);
	if (Number.isNaN(offset) || offset < 0 || offset > Number.MAX_SAFE_INTEGER)
		offset = 0;
	req.offset = offset;

	next();
};

export default DatabaseLimit;
