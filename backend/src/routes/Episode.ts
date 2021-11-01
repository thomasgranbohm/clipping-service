import { Router } from 'express';
import { Clip } from 'database/models/Clip';
import { Episode } from 'database/models/Episode';
import DatabaseLimit from 'middlewares/DatabaseLimit';

const router = Router();

router.get('/', DatabaseLimit, async (req, res) => {
	const { limit, offset } = req;
	const [episodes, total] = await Promise.all([
		Episode.findAll({
			limit,
			order: [['index', 'ASC']],
			offset,
		}),
		Episode.count(),
	]);

	return res.json({ episodes, offset, total });
});

router.get('/:id', async (req, res) => {
	const episode = await Episode.findOne({ where: { id: req.params.id } });

	return res.json({ episode });
});

router.get('/:id/clips', DatabaseLimit, async (req, res) => {
	const { limit, offset } = req;
	const [clips, total] = await Promise.all([
		Clip.findAll({ limit, offset, where: { episodeId: req.params.id } }),
		Clip.count({ where: { episodeId: req.params.id } }),
	]);

	return res.json({ clips, offset, total });
});

router.get('/:id/clips/:clipId', async (req, res) =>
	res.redirect(`/clips/${req.params.clipId}`)
);

export default router;
