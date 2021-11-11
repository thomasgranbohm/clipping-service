import { Episode } from 'database/models/Episode';
import { Season } from 'database/models/Season';
import { Router } from 'express';
import DatabaseLimit from 'middlewares/DatabaseLimit';
import MissingArgs from 'middlewares/MissingArgs';
import { Includeable } from 'sequelize/types';
import { getMedia } from 'services/PlexAPI';
import { getShowWhereOptions, SHOW_REQUIRED_ARGS } from './Show';

const router = Router();

export const SEASON_REQUIRED_ARGS = ['show', ...SHOW_REQUIRED_ARGS];

export const getSeasonWhereOptions = (
	season: any,
	...args: Parameters<typeof getShowWhereOptions>
): Includeable => {
	return {
		model: Season.scope("stripped"),
		where: { index: parseInt(season) },
		include: [getShowWhereOptions(...args)],
	};
};

router.use(MissingArgs(SEASON_REQUIRED_ARGS));

router.get('/', DatabaseLimit, async (req, res) => {
	const { limit, offset } = req;
	const { library, show } = req.query;

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

	return res.json({ offset, items, total, type: 'season' });
});

router.get('/:index', async (req, res) => {
	const { index } = req.params;
	const { library, show } = req.query;

	const season = await Season.findOne({
		where: { index },
		include: [getShowWhereOptions(show, library)],
	});

	return res.json(season);
});

router.get('/:index/episodes', DatabaseLimit, async (req, res) => {
	const { limit, offset } = req;
	const { index } = req.params;
	const { library, show } = req.query;

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

	return res.json({ items, offset, total, type: 'episode' });
});

router.get('/:index/thumbnail', async (req, res) => {
	const { index } = req.params;
	const { library, show } = req.query;

	try {
		const { thumb } = await Season.findOne({
			attributes: ['thumb'],
			where: { index },
			include: [getShowWhereOptions(show, library)],
		});
		if (!thumb)
			throw {
				name: '404',
				description: 'Could not find season.',
			};

		const { data } = await getMedia(thumb);

		data.pipe(res);
	} catch (error) {
		console.log(error);
		return res.status(400).json({ error });
	}
});

router.get('/:id/episodes/:episodeId', async (req, res) =>
	res.redirect(`/episodes/${req.params.episodeId}`)
);

export default router;
