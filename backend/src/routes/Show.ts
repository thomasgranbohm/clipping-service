import { Router } from 'express';
import { Season } from 'database/models/Season';
import { Show } from 'database/models/Show';
import DatabaseLimit from 'middlewares/DatabaseLimit';

const router = Router();

router.get('/', DatabaseLimit, async (req, res) => {
	const { limit, offset } = req;
	const shows = await Show.findAll({
		limit: limit,
		offset: offset,
		order: [['title', 'ASC']],
	});
	const total = await Show.count();

	return res.json({ shows, offset, total });
});

router.get('/:id', async (req, res) => {
	const show = await Show.findOne({
		where: { id: req.params.id },
	});

	return res.json({ show });
});

router.get('/:id/seasons', DatabaseLimit, async (req, res) => {
	const { limit, offset } = req;
	const [seasons, total] = await Promise.all([
		Season.findAll({
			limit,
			offset,
			order: [['index', 'ASC']],
			where: { showId: req.params.id },
		}),
		Season.count({ where: { showId: req.params.id } }),
	]);

	return res.json({ offset, seasons, total });
});

router.get('/:id/seasons/:seasonId', async (req, res) =>
	res.redirect(`/seasons/${req.params.seasonId}`)
);

export default router;
