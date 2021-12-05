import { Router } from 'express';
import { Includeable } from 'sequelize/types';
import { Clip } from '../database/models/Clip';
import { Episode } from '../database/models/Episode';
import { getNextUrl } from '../functions';
import DatabaseLimit from '../middlewares/DatabaseLimit';
import MissingArgs from '../middlewares/MissingArgs';
import { getMedia } from '../services/PlexAPI';
import { stream } from '../services/Streamer';
import { CustomError } from '../types';
import { getSeasonWhereOptions, SEASON_REQUIRED_ARGS } from './Season';

const router = Router();

export const EPISODE_REQUIRED_ARGS = ['season', ...SEASON_REQUIRED_ARGS];

export const getEpisodeWhereOptions = (
	episode: any,
	...args: Parameters<typeof getSeasonWhereOptions>
): Includeable => {
	return {
		include: [getSeasonWhereOptions(...args)],
		model: Episode.scope('stripped'),
		required: true,
		...(episode ? { where: { slug: episode.toString() } } : {}),
	};
};

router.use(MissingArgs(EPISODE_REQUIRED_ARGS));

router.get('/', DatabaseLimit, async (req, res, next) => {
	const { limit, offset } = req;
	const { library, season, show } = req.query;

	try {
		const [items, total] = await Promise.all([
			Episode.findAll({
				limit,
				order: [['index', 'ASC']],
				offset,
				include: [getSeasonWhereOptions(season, show, library)],
			}),
			Episode.count(),
		]);

		if (items.length === 0 && total === 0)
			throw new CustomError({
				status: 404,
				message: 'No episodes found in season.',
			});

		return res.json({
			items,
			next: getNextUrl(req, items.length),
			total,
			type: 'episode',
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

router.get('/:slug', async (req, res, next) => {
	const { slug } = req.params;
	const { library, season, show } = req.query;

	try {
		const episode = await Episode.findOne({
			where: { slug },
			include: [getSeasonWhereOptions(season, show, library)],
		});

		if (!episode)
			throw new CustomError({
				status: 404,
				message: 'Episode not found in season.',
			});

		return res.json(episode);
	} catch (error) {
		next({
			status: error['status'] || 500,
			message: error['message'],
			stack: error['stack'],
			error,
		});
	}
});

router.get('/:slug/items', DatabaseLimit, async (req, res, next) => {
	const { limit, offset } = req;
	const { slug } = req.params;
	const { library, season, show } = req.query;

	try {
		const [items, total] = await Promise.all([
			Clip.findAll({
				limit,
				offset,
				include: [getEpisodeWhereOptions(slug, season, show, library)],
			}),
			Clip.count({
				include: [getEpisodeWhereOptions(slug, season, show, library)],
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

router.get('/:slug/thumbnail', async (req, res, next) => {
	const { slug } = req.params;
	const { library, season, show } = req.query;

	try {
		const episode = await Episode.findOne({
			attributes: ['thumb'],
			where: { slug },
			include: [getSeasonWhereOptions(season, show, library)],
		});
		if (!episode)
			throw {
				name: '404',
				description: 'Could not find episode.',
			};

		const { thumb } = episode;

		if (!thumb)
			throw new CustomError({
				status: 404,
				message: 'No thumbnail found for episode.',
			});

		const { data } = await getMedia(thumb);

		data.pipe(res);
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
	const { library, season, show } = req.query;

	try {
		const episode = await Episode.findOne({
			where: { slug },
			include: [getSeasonWhereOptions(season, show, library)],
		});
		if (!episode)
			throw new CustomError({
				status: 404,
				message: 'Episode not found in season.',
			});

		return stream(req, res, episode.filePath);
	} catch (error) {
		next({
			status: error['status'] || 500,
			message: error['message'],
			stack: error['stack'],
			error,
		});
	}
});

router.get('/:id/items/:clipId', async (req, res) =>
	res.redirect(`/clip/${req.params.clipId}`)
);

export default router;
