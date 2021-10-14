import { Router } from 'express';
import { Clip } from '../database/models/Clip';
import { Episode } from '../database/models/Episode';
import { Season } from '../database/models/Season';
import { Show } from '../database/models/Show';

const router = Router();

router.get('/', async (req, res) => {
	const clips = await Clip.findAll();
	return res.json({ clips });
});

router.post('/', async (req, res) => {
	const { name, episodeId, start, end } = req.body;

	try {
		const episode = await Episode.findOne({
			where: { id: episodeId },
			include: [Season, Show],
		});
		if (!episode) throw new Error('Episode not found.');

		if (end < start)
			throw {
				name: 400,
				description: 'End cannot be before start.',
			};

		const clip = await Clip.create({
			name,
			start,
			end,
			episodeId,
			seasonId: episode.seasonId,
			showId: episode.showId,
		});

		return res.json({ clip });
	} catch (error) {
		console.log(error);
		return res.json({ error });
	}
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const clip = await Clip.findOne({
			where: { id },
		});
		if (!clip)
			throw {
				name: '404',
				description: 'Could not find clip.',
			};

		return res.json({ clip });
	} catch (error) {
		return res.json({ error });
	}
});

export default router;
