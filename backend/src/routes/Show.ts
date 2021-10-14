import { Router } from 'express';
import { Season } from '../database/models/Season';
import { Show } from '../database/models/Show';

const router = Router();

router.get('/', async (req, res) => {
	const shows = await Show.findAll();

	return res.json(shows);
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const show = await Show.findOne({
			where: { id },
			include: [Season],
		});

		if (!show)
			throw {
				name: '404',
				description: 'Could not find show.',
			};

		return res.json(show);
	} catch (error) {
		return res.json({
			error,
		});
	}
});

export default router;
