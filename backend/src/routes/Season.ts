import { Router } from 'express';
import { Clip } from '../database/models/Clip';
import { Episode } from '../database/models/Episode';
import { Season } from '../database/models/Season';
import { Show } from '../database/models/Show';

const router = Router();

router.get('/', async (req, res) => {
	try {
		const seasons = await Season.findAll();

		return res.json({ seasons });
	} catch (error) {
		console.error(error);
		return res.json({ error });
	}
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const season = await Season.findOne({
			where: { id },
			include: [Show, Episode, Clip],
		});

		return res.json({ season });
	} catch (error) {
		console.error(error);
		return res.json({ error });
	}
});

export default router;
