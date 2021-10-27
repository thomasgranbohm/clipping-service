import { Router } from 'express';
import { createReadStream } from 'fs';
import { lookup } from 'mime';
import { totalmem } from 'os';
import { Clip } from '../database/models/Clip';
import { getItemDetails } from '../services/PlexAPI';
import { stream } from '../services/Streamer';

const router = Router();

router.get('/', async (req, res) => {
	const offset =
		(req.query.offset && parseInt(req.query.offset.toString())) || 0;

	const clips = await Clip.findAll({
		offset,
		limit: 10,
		order: [['createdAt', 'DESC']],
	});

	const count = await Clip.count();

	return res.json({ clips, total: count });
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
		return res.status(400).json({ error });
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
				name: 404,
				description: 'Could not find clip.',
			};
		else if (!clip.ready)
			throw {
				name: 400,
				description: 'File not ready yet.',
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

		return stream(req, res, clip.getMediaPath());
	} catch (error) {
		return res.status(400).json({ error });
	}
});

router.get('/:slug/download', async (req, res) => {
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

		res.setHeader(
			'Content-disposition',
			`attachment; filename=${clip.slug}.mp4`
		);
		res.setHeader('Content-type', 'video/mp4');

		const filestream = createReadStream(clip.getMediaPath());
		filestream.pipe(res);
	} catch (error) {
		console.error(error);
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
