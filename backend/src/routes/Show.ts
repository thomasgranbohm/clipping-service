import { Router } from 'express';
import { Season } from 'database/models/Season';
import { Show } from 'database/models/Show';
import DatabaseLimit from 'middlewares/DatabaseLimit';

const router = Router();

router.get('/', DatabaseLimit, async (req, res) => {
	const { limit, offset } = req;
	const items = await Show.findAll({
		limit: limit,
		offset: offset,
		order: [['title', 'ASC']],
	});
	const total = await Show.count();

	return res.json({ items, offset, total, type: 'show' });
});

router.get('/:slug', async (req, res) => {
	const show = await Show.findOne({
		where: { slug: req.params.slug },
	});

	return res.json({ show });
});

router.get('/:slug/seasons', DatabaseLimit, async (req, res) => {
	const { slug } = req.params;
	const { id } = await Show.findOne({ where: { slug }, attributes: ['id'] });

	const { limit, offset } = req;
	const [items, total] = await Promise.all([
		Season.findAll({
			limit,
			offset,
			order: [['index', 'ASC']],
			where: { showId: id },
		}),
		Season.count({ where: { showId: id } }),
	]);

	return res.json({ items, offset, total, type: 'season' });
});

router.get('/:id/seasons/:seasonId', async (req, res) =>
	res.redirect(`/seasons/${req.params.seasonId}`)
);

export default router;
