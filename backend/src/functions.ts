import { Request } from 'express';
import { URL } from 'url';

export const getNextUrl = (req: Request, newOffset: number) => {
	const nextUrl = new URL(req.originalUrl, process.env.BACKEND_URL);

	nextUrl.searchParams.set('offset', (req.offset + newOffset).toString());

	return `${nextUrl.pathname}${nextUrl.search}`;
};
