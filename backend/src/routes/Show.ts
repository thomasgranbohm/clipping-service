import { Show } from '../database/entities/Show';
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
	const shows = await Show.find({});

	return res.json(shows);
});

router.get('/:showName', async (req, res) => {
	const { showName } = req.params;

	try {
		const show = await Show.findOneOrFail(
			{ name: showName },
			{ relations: ['seasons', 'seasons.episodes', 'seasons.episodes.clips'] }
		);

		return res.json(show);
	} catch (error) {
		return res.json({
			error: {
				name: 'An error occurred.',
			},
		});
	}
});

export default router;
