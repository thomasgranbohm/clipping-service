import { Router } from 'express';
import { resolve } from 'path';
import { Clip } from '../database/models/Clip';
import { getItemDetails } from '../services/PlexAPI';

const router = Router();

router.get('/', async (req, res) => {
	const clips = await Clip.findAll();
	return res.json({ clips });
});

router.post('/', async (req, res) => {
	const { name, metadataId, start, end } = req.body;

	try {
		const episode = await getItemDetails(metadataId);

		if (episode.type !== 'episode' || episode.key)
			return {
				name: 400,
				description: 'Cannot create a clip from a non-episode.',
			};

		const metadata = episode['Metadata'].pop();

		if (metadata)
			if (end < start)
				throw {
					name: 400,
					description: 'End cannot be before start.',
				};

		if (start < 0 || end > episode.duration)
			throw {
				name: 400,
				description: 'Start or end is beyond boundaries.',
			};

		const clip = await Clip.create({
			name,
			start,
			end,
			metadataId,
			seasonId: parseInt(metadata.parentRatingKey),
			showId: parseInt(metadata.grandparentRatingKey),
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

router.get('/:id/watch', async (req, res) => {
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
		else if (!clip.ready)
			throw {
				name: 400,
				description: 'File not ready yet.',
			};

		return res.sendFile(resolve(process.cwd(), 'clips', clip.slug + '.mp4'));
	} catch (error) {
		return res.json({ error });
	}
});

export default router;
