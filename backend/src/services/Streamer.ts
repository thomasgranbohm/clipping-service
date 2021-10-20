import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';

export const stream = async (req: Request, res: Response, path: string) => {
	const videoStat = await stat(path);
	const { size } = videoStat;

	const { range } = req.headers;

	if (range) {
		const parts = range.replace(/bytes=/, '').split('-');
		const start = parseInt(parts[0], 10);
		const end = parts[1] ? parseInt(parts[1], 10) : size - 1;

		const chunkSize = end - start + 1;

		const stream = createReadStream(path, { start, end });
		res.writeHead(206, {
			'Content-Range': `bytes ${start}-${end}/${size}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunkSize,
			'Content-Type': 'video/mp4',
		});

		return stream.pipe(res);
	} else {
		res.writeHead(200, {
			'Content-Length': size,
			'Content-Type': 'video/mp4',
		});

		return createReadStream(path).pipe(res);
	}
};
