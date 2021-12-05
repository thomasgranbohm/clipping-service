import { Router } from 'express';
import { createReadStream } from 'fs';
import { Includeable } from 'sequelize/types';
import { TITLE_REGEX } from '../constants';
import { Clip } from '../database/models/Clip';
import { Episode } from '../database/models/Episode';
import { getNextUrl } from '../functions';
import Authentication from '../middlewares/Authentication';
import DatabaseLimit from '../middlewares/DatabaseLimit';
import { stream } from '../services/Streamer';
import { CustomError } from '../types';
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

router.get('/', DatabaseLimit, async (req, res, next) => {
	const { limit, offset } = req;

	try {
		const [items, total] = await Promise.all([
			Clip.findAll({
				limit,
				offset,
				order: [['createdAt', 'DESC']],
				where: { ready: true },
				include: [getAppropriateWhereOptions(req.query)],
			}),
			Clip.count({
				where: { ready: true },
				include: [getAppropriateWhereOptions(req.query)],
			}),
		]);

		// Removed
		// if (items.length === 0 && total === 0)
		// 	throw new CustomError({
		// 		status: 404,
		// 		message: 'No clips found in episode.',
		// 	});

		return res.json({
			items,
			next: getNextUrl(req, items.length),
			total,
			type: 'clip',
		});
	} catch (error) {
		next({
			status: error['status'] || 500,
			message: error['message'],
			stack: error['stack'],
			error,
		});
	}
});

router.post('/', Authentication, async (req, res, next) => {
	const { title, episode, season, show, library, start, end } = req.body;

	try {
		const foundEpisode = await Episode.findOne({
			where: { slug: episode },
			include: [getSeasonWhereOptions(season, show, library)],
		});

		if (!foundEpisode)
			throw new CustomError({
				status: 404,
				message: 'Episode not found in season.',
			});

		if (!title || title.length === 0)
			throw new CustomError({
				status: 400,
				message: 'Title cannot be null.',
			});

		if (!TITLE_REGEX.test(title))
			throw new CustomError({
				status: 400,
				message: `Title does not pass regex test (${TITLE_REGEX.toString()})`,
			});

		if (end < start)
			throw new CustomError({
				status: 400,
				message: 'End cannot be before start.',
			});

		if (start < 0 || end > foundEpisode.duration)
			throw new CustomError({
				status: 400,
				message: 'Start or end is beyond boundaries.',
			});

		const clip = await Clip.create({
			title,
			start,
			end,
			episodeId: foundEpisode.id,
		});

		return res.json(clip);
	} catch (error) {
		next({
			status: error['status'] || 500,
			message: error['message'],
			stack: error['stack'],
			error,
		});
	}
});

router.get('/:slug', async (req, res, next) => {
	const { slug } = req.params;

	try {
		const clip = await Clip.findOne({
			where: { slug },
			include: [getAppropriateWhereOptions(req.query)],
		});
		if (!clip)
			throw new CustomError({
				status: 404,
				message: 'Clip not found.',
			});
		else if (!clip.ready)
			throw new CustomError({
				status: 425,
				message: 'Clip not ready.',
			});

		return res.json(clip);
	} catch (error) {
		next({
			status: error['status'] || 500,
			message: error['message'],
			stack: error['stack'],
			error,
		});
	}
});

router.delete('/:slug', async (req, res, next) => {
	const { slug } = req.params;

	try {
		const clip = await Clip.findOne({
			where: { slug },
		});
		await clip.destroy();

		return res.json({ deleted: clip });
	} catch (error) {
		next({
			status: error['status'] || 500,
			message: error['message'],
			stack: error['stack'],
			error,
		});
	}
});

router.get('/:slug/watch', async (req, res, next) => {
	const { slug } = req.params;

	try {
		const clip = await Clip.findOne({
			where: { slug },
		});
		if (!clip)
			throw new CustomError({
				status: 404,
				message: 'Clip not found.',
			});
		else if (!clip.ready)
			throw new CustomError({
				status: 425,
				message: 'Clip not ready.',
			});

		return stream(req, res, clip.getMediaPath());
	} catch (error) {
		next({
			status: error['status'] || 500,
			message: error['message'],
			stack: error['stack'],
			error,
		});
	}
});

router.get('/:slug/download', async (req, res, next) => {
	const { slug } = req.params;

	try {
		const clip = await Clip.findOne({
			where: { slug },
		});
		if (!clip)
			throw new CustomError({
				status: 404,
				message: 'Clip not found.',
			});
		else if (!clip.ready)
			throw new CustomError({
				status: 425,
				message: 'Clip not ready.',
			});

		res.setHeader(
			'Content-disposition',
			`attachment; filename=${clip.slug}.mp4`
		);
		res.setHeader('Content-type', 'video/mp4');

		const filestream = createReadStream(clip.getMediaPath());
		filestream.pipe(res);
	} catch (error) {
		next({
			status: error['status'] || 500,
			message: error['message'],
			stack: error['stack'],
			error,
		});
	}
});

router.get('/:slug/thumbnail', async (req, res, next) => {
	const { slug } = req.params;

	try {
		const clip = await Clip.findOne({
			where: { slug },
		});
		if (!clip)
			throw new CustomError({
				status: 404,
				message: 'Clip not found.',
			});
		else if (!clip.ready)
			throw new CustomError({
				status: 425,
				message: 'Clip not ready.',
			});

		return res.sendFile(clip.getThumbnailPath());
	} catch (error) {
		next({
			status: error['status'] || 500,
			message: error['message'],
			stack: error['stack'],
			error,
		});
	}
});

router.get('/:slug/oembed', async (req, res, next) => {
	const { slug } = req.params;

	try {
		const clip = await Clip.findOne({
			where: { slug },
		});
		if (!clip)
			throw new CustomError({
				status: 404,
				message: 'Clip not found.',
			});
		else if (!clip.ready)
			throw new CustomError({
				status: 425,
				message: 'Clip not ready.',
			});

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
		next({
			status: error['status'] || 500,
			message: error['message'],
			stack: error['stack'],
			error,
		});
	}
});

export default router;
