import { Router } from 'express';
import { createReadStream } from 'fs';
import { Includeable } from 'sequelize/types';
import { Clip } from '../database/models/Clip';
import { Episode } from '../database/models/Episode';
import { getNextUrl } from '../functions';
import DatabaseLimit from '../middlewares/DatabaseLimit';
import { stream } from '../services/Streamer';
import { EPISODE_REQUIRED_ARGS, getEpisodeWhereOptions } from './Episode';
import { getSeasonWhereOptions } from './Season';

const router = Router();

export const getClipWhereOptions = (
	clip: any,
	...args: Parameters<typeof getEpisodeWhereOptions>
): Includeable => {
	return {
		attributes: [],
		include: [getEpisodeWhereOptions(...args)],
		model: Clip,
		required: true,
		...(clip ? { where: { slug: clip.toString() } } : {}),
	};
};

export const CLIP_REQUIRED_ARGS = ['season', ...EPISODE_REQUIRED_ARGS];

const getAppropriateWhereOptions = (query): Includeable => {
	const { episode, library, season, show } = query;
	return getEpisodeWhereOptions(episode, season, show, library);
};

router.get('/', DatabaseLimit, async (req, res) => {
	const { limit, offset } = req;

	const [items, total] = await Promise.all([
		Clip.findAll({
			limit,
			offset,
			order: [['createdAt', 'DESC']],
			include: [getAppropriateWhereOptions(req.query)],
		}),
		Clip.count({
			include: [getAppropriateWhereOptions(req.query)],
		}),
	]);

	return res.json({
		items,
		next: getNextUrl(req, items.length),
		total,
		type: 'clip',
	});
});

router.post('/', async (req, res) => {
	const { title, episode, season, show, library, start, end } = req.body;

	try {
		const foundEpisode = await Episode.findOne({
			where: { slug: episode },
			include: [getSeasonWhereOptions(season, show, library)],
		});

		if (!foundEpisode)
			throw {
				status: 404,
				message: 'Could not find episode.',
			};

		if (!title || title.length === 0)
			throw {
				status: 400,
				message: 'Title cannot be null.',
			};

		if (!/[a-zA-Z0-9\s\-.,;:()"']/.test(title)) {
			throw {
				status: 400,
				message: 'Title does not pass regex test ([a-zA-Z0-9\\s\\-.,;:()"\']])',
			};
		}

		if (end < start)
			throw {
				status: 400,
				message: 'End cannot be before start.',
			};

		if (start < 0 || end > foundEpisode.duration)
			throw {
				status: 400,
				message: 'Start or end is beyond boundaries.',
			};

		const clip = await Clip.create({
			title,
			start,
			end,
			episodeId: foundEpisode.id,
		});

		return res.json(clip);
	} catch (error) {
		console.log(error);
		return res
			.status(error['status'] || 400)
			.json(error['message'] || { error });
	}
});

router.get('/:slug', async (req, res) => {
	const { slug } = req.params;

	try {
		const clip = await Clip.findOne({
			where: { slug },
			include: [getAppropriateWhereOptions(req.query)],
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
		const clip = await Clip.findOne({
			where: { slug },
		});
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
			type: 'video',
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
