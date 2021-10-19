import { Router } from 'express';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { Clip } from '../database/models/Clip';
import { getItemDetails } from '../services/PlexAPI';

const router = Router();

router.get('/', async (req, res) => {
	const clips = await Clip.findAll();
	return res.json({ clips });
});

router.post('/', async (req, res) => {
	const { name, metadataKey, start, end } = req.body;

	try {
		const episode = await getItemDetails(metadataKey);

		if (episode.type !== 'episode' || !episode.key)
			return res.status(400).json({
				description: 'Cannot create a clip from a non-episode.',
			});

		if (end < start)
			throw {
				name: 400,
				description: 'End cannot be before start.',
			};

		if (start < 0 || end > episode.duration)
			throw {
				name: 400,
				description: 'Start or end is beyond boundaries.',
			};

		const clip = await Clip.create({
			name,
			start,
			end,
			metadataKey,
			seasonKey: parseInt(episode.seasonKey),
			showKey: parseInt(episode.showKey),
			libraryKey: parseInt(episode.libraryKey),
			seasonTitle: episode.seasonTitle,
			showTitle: episode.showTitle,
			libraryTitle: episode.libraryTitle,
		});

		return res.json(clip);
	} catch (error) {
		console.log(error);
		return res.json({ error });
	}
});

router.get('/:slug', async (req, res) => {
	const { slug } = req.params;

	try {
		const clip = await Clip.findOne({
			where: { slug },
		});
		if (!clip)
			throw {
				name: '404',
				description: 'Could not find clip.',
			};

		return res.json(clip);
	} catch (error) {
		return res.status(404).json({ error });
	}
});

router.delete('/:slug', async (req, res) => {
	const { slug } = req.params;

	try {
		const clip = await Clip.findOne({ where: { slug } });
		await clip.destroy();

		return res.json({ deleted: clip });
	} catch (error) {
		return res.status(404).json({ error });
	}
});

router.get('/:slug/watch', async (req, res) => {
	const { slug } = req.params;

	try {
		const clip = await Clip.findOne({
			where: { slug },
		});
		if (!clip)
			throw {
				name: '404',
				description: 'Could not find clip.',
			};
		else if (!clip.ready)
			throw {
				name: 400,
				description: 'File not ready yet.',
			};

		const videoStat = await stat(clip.getMediaPath());
		const { size } = videoStat;

		const { range } = req.headers;
		if (range) {
			const parts = range.replace(/bytes=/, '').split('-');
			const start = parseInt(parts[0], 10);
			const end = parts[1] ? parseInt(parts[1], 10) : size - 1;

			const chunkSize = end - start + 1;

			const stream = createReadStream(clip.getMediaPath(), { start, end });
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

			return createReadStream(clip.getMediaPath()).pipe(res);
		}
	} catch (error) {
		return res.status(400).json({ error });
	}
});

router.get('/:slug/thumbnail', async (req, res) => {
	const { slug } = req.params;

	try {
		const clip = await Clip.findOne({
			where: { slug },
		});
		if (!clip)
			throw {
				name: '404',
				description: 'Could not find clip.',
			};
		else if (!clip.ready)
			throw {
				name: 400,
				description: 'File not ready yet.',
			};

		return res.sendFile(clip.getThumbnailPath());
	} catch (error) {
		return res.status(400).json({ error });
	}
});

router.get('/:slug/oembed', async (req, res) => {
	const { slug } = req.params;

	try {
		const clip = await Clip.findOne({
			where: { slug },
		});
		if (!clip)
			throw {
				name: '404',
				description: 'Could not find clip.',
			};
		else if (!clip.ready)
			throw {
				name: 400,
				description: 'File not ready yet.',
			};

		return res.json({
			version: '1.0',
			type: 'link',
			provider_name: 'Clipping Service',
			provider_url: process.env.FRONTEND_URL,
			thumbnail_height: 720,
			thumbnail_url: `${process.env.FRONTEND_URL}/api/clips/${clip.slug}/thumbnail`,
			thumbnail_width: 1200,
			width: 320,
			height: 200,
			html: `<iframe width="320" height="200" src="${process.env.FRONTEND_URL}/api/clips/${clip.slug}/watch" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
		});
	} catch (error) {
		return res.status(400).json({ error });
	}
});

export default router;
