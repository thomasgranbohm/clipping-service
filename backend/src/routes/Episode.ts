import { Clip } from '../database/models/Clip';
import { Episode } from '../database/models/Episode';
import { Season } from '../database/models/Season';
import { Show } from '../database/models/Show';
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
	try {
		const episodes = await Episode.findAll();

		return res.json({ episodes });
	} catch (error) {
		return res.json({ error });
	}
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const episode = await Episode.findOne({
			where: { id },
			include: [Clip, Season, Show],
		});
		if (!episode)
			throw {
				name: '404',
				description: 'Could not find episode.',
			};

		return res.json({ episode });
	} catch (error) {
		console.log(error);

		return res.json({ error });
	}
});

export default router;
