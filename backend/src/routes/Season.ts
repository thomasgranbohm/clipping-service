import { Router } from 'express';
import { Includeable } from 'sequelize/types';
import { Episode } from '../database/models/Episode';
import { Season } from '../database/models/Season';
import { getNextUrl } from '../functions';
import DatabaseLimit from '../middlewares/DatabaseLimit';
import MissingArgs from '../middlewares/MissingArgs';
import { getMedia } from '../services/PlexAPI';
import { CustomError } from '../types';
import { getShowWhereOptions, SHOW_REQUIRED_ARGS } from './Show';

const router = Router();

export const SEASON_REQUIRED_ARGS = ['show', ...SHOW_REQUIRED_ARGS];

export const getSeasonWhereOptions = (
	season: any,
	...args: Parameters<typeof getShowWhereOptions>
): Includeable => {
	return {
		include: [getShowWhereOptions(...args)],
		model: Season.scope('stripped'),
		required: true,
		...(season ? { where: { index: season.toString() } } : {}),
	};
};

router.use(MissingArgs(SEASON_REQUIRED_ARGS));

router.get('/', DatabaseLimit, async (req, res, next) => {
	const { limit, offset } = req;
	const { library, show } = req.query;

	try {
		const [items, total] = await Promise.all([
			Season.findAll({
				limit,
				offset,
				order: [['index', 'ASC']],
				include: [getShowWhereOptions(show, library)],
			}),
			Season.count({
				include: [getShowWhereOptions(show, library)],
			}),
		]);

		if (items.length === 0 && total === 0)
			throw new CustomError({
				status: 404,
				message: 'No seasons found in show.',
			});

		return res.json({
			next: getNextUrl(req, items.length),
			items,
			total,
			type: 'season',
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

router.get('/:index', async (req, res, next) => {
	const { index } = req.params;
	const { library, show } = req.query;

	try {
		const season = await Season.findOne({
			where: { index },
			include: [getShowWhereOptions(show, library)],
		});

		if (!season)
			throw new CustomError({
				status: 404,
				message: 'Season not found in show.',
			});

		return res.json(season);
	} catch (error) {
		next({
			status: error['status'] || 500,
			message: error['message'],
			stack: error['stack'],
			error,
		});
	}
});

router.get('/:index/items', DatabaseLimit, async (req, res, next) => {
	const { limit, offset } = req;
	const { index } = req.params;
	const { library, show } = req.query;

	try {
		const [items, total] = await Promise.all([
			Episode.findAll({
				limit,
				offset,
				order: [['index', 'ASC']],
				include: [getSeasonWhereOptions(index, show, library)],
			}),
			Episode.count({
				include: [getSeasonWhereOptions(index, show, library)],
			}),
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

router.get('/:index/thumbnail', async (req, res, next) => {
	const { index } = req.params;
	const { library, show } = req.query;

	try {
		const season = await Season.findOne({
			attributes: ['thumb'],
			where: { index },
			include: [getShowWhereOptions(show, library)],
		});

		if (!season)
			throw new CustomError({
				status: 404,
				message: 'Season not found in show.',
			});

		const { thumb } = season;
		if (!thumb)
			throw new CustomError({
				status: 404,
				message: 'No thumbnail found for season.',
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

router.get('/:id/items/:episodeId', async (req, res) =>
	res.redirect(`/episodes/${req.params.episodeId}`)
);

export default router;
