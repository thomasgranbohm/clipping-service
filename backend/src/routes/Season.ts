import { Router } from 'express';
import { Episode } from 'database/models/Episode';
import { Season } from 'database/models/Season';
import DatabaseLimit from 'middlewares/DatabaseLimit';

const router = Router();

router.get('/', DatabaseLimit, async (req, res) => {
	const { limit, offset } = req;
	const [seasons, total] = await Promise.all([
		Season.findAll({
			limit,
			offset,
			order: [['index', 'ASC']],
		}),
		Season.count(),
	]);

	return res.json({ offset, seasons, total });
});

router.get('/:id', async (req, res) => {
	const season = await Season.findOne({ where: { id: req.params.id } });

	return res.json({ season });
});

router.get('/:id/episodes', DatabaseLimit, async (req, res) => {
	const { limit, offset } = req;
	const [episodes, total] = await Promise.all([
		Episode.findAll({
			limit,
			offset,
			order: [['index', 'ASC']],
			where: { seasonId: req.params.id },
		}),
		Episode.count({ where: { seasonId: req.params.id } }),
	]);

	return res.json({ episodes, offset, total });
});

router.get('/:id/episodes/:episodeId', async (req, res) =>
	res.redirect(`/episodes/${req.params.episodeId}`)
);

export default router;
