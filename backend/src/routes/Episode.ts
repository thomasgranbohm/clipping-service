import { Router } from 'express';
import { Clip } from 'database/models/Clip';
import { Episode } from 'database/models/Episode';
import DatabaseLimit from 'middlewares/DatabaseLimit';
import { Season } from 'database/models/Season';
import { Show } from 'database/models/Show';
import MissingArgs from 'middlewares/MissingArgs';
import { Includeable } from 'sequelize/types';
import { getSeasonWhereOptions, SEASON_REQUIRED_ARGS } from './Season';
import { getMedia } from 'services/PlexAPI';
import { IncomingMessage } from 'http';

const router = Router();

export const EPISODE_REQUIRED_ARGS = ['season', ...SEASON_REQUIRED_ARGS];

export const getEpisodeWhereOptions = (
	episode: any,
	...args: Parameters<typeof getSeasonWhereOptions>
): Includeable => {
	return {
		attributes: [],
		model: Episode,
		where: { slug: episode.toString() },
		include: [getSeasonWhereOptions(...args)],
	};
};

router.use(MissingArgs(EPISODE_REQUIRED_ARGS));

router.get('/', DatabaseLimit, async (req, res) => {
	const { limit, offset } = req;
	const { library, season, show } = req.query;

	const [items, total] = await Promise.all([
		Episode.findAll({
			limit,
			order: [['index', 'ASC']],
			offset,
			include: [getSeasonWhereOptions(season, show, library)],
		}),
		Episode.count(),
	]);

	return res.json({ items, offset, total, type: 'episode' });
});

router.get('/:slug', async (req, res) => {
	const { slug } = req.params;
	const { library, season, show } = req.query;

	const episode = await Episode.findOne({
		where: { slug },
		include: [getSeasonWhereOptions(season, show, library)],
	});

	return res.json(episode);
});

router.get('/:slug/clips', DatabaseLimit, async (req, res) => {
	const { limit, offset } = req;
	const { slug } = req.params;
	const { library, season, show } = req.query;

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

	return res.json({ items, offset, total, type: 'clip' });
});

router.get('/:slug/thumbnail', async (req, res) => {
	const { slug } = req.params;
	const { library, season, show } = req.query;

	try {
		const { thumb } = await Episode.findOne({
			attributes: ['thumb'],
			where: { slug },
			include: [getSeasonWhereOptions(season, show, library)],
		});
		if (!thumb)
			throw {
				name: '404',
				description: 'Could not find episode.',
			};

		const { data } = await getMedia(thumb);

		data.pipe(res);
	} catch (error) {
		return res.status(400).json({ error });
	}
});

router.get('/:id/clips/:clipId', async (req, res) =>
	res.redirect(`/clips/${req.params.clipId}`)
);

export default router;
