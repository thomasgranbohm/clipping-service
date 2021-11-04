import { Router } from 'express';
import { Episode } from 'database/models/Episode';
import { Season } from 'database/models/Season';
import DatabaseLimit from 'middlewares/DatabaseLimit';
import { Show } from 'database/models/Show';

const router = Router();

router.get('/', DatabaseLimit, async (req, res) => {
	const { limit, offset } = req;
	const [items, total] = await Promise.all([
		Season.findAll({
			limit,
			offset,
			order: [['index', 'ASC']],
		}),
		Season.count(),
	]);

	return res.json({ offset, items, total, type: 'season' });
});

router.get('/:slug/:index', async (req, res) => {
	const { index, slug } = req.params;
	const season = await Season.findOne({
		where: { index },
		include: [
			{
				model: Show,
				where: { slug },
				attributes: ['title'],
			},
		],
	});

	return res.json(season);
});

router.get('/:slug/:index/episodes', DatabaseLimit, async (req, res) => {
	const { limit, offset } = req;
	const { index, slug } = req.params;

	const where = {
		include: [
			{
				model: Season,
				where: { index },
				attributes: [],
				include: [
					{
						model: Show,
						where: { slug },
						attributes: [],
					},
				],
			},
		],
	};

	const [items, total] = await Promise.all([
		Episode.findAll({
			limit,
			offset,
			order: [['index', 'ASC']],
			...where,
		}),
		Episode.count(where),
	]);

	return res.json({ items, offset, total, type: 'episode' });
});

router.get('/:id/episodes/:episodeId', async (req, res) =>
	res.redirect(`/episodes/${req.params.episodeId}`)
);

export default router;
