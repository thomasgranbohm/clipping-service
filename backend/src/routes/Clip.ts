import { CLIPS_DIR } from '../constants';
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
	const { name, metadataKey, start, end } = req.body;

	try {
		const episode = await getItemDetails(metadataKey);

		if (episode.type !== 'episode' || !episode.key)
			return res.status(400).json({
				description: 'Cannot create a clip from a non-episode.',
			});

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
			metadataKey,
			seasonKey: parseInt(episode.seasonKey),
			showKey: parseInt(episode.showKey),
			libraryKey: parseInt(episode.libraryKey),
			seasonTitle: episode.seasonTitle,
			showTitle: episode.showTitle,
			libraryTitle: episode.libraryTitle,
		});

		return res.json(clip);
	} catch (error) {
		console.log(error);
		return res.json({ error });
	}
});

router.get('/:slug', async (req, res) => {
	const { slug } = req.params;

	try {
		const clip = await Clip.findOne({
			where: { slug },
		});
		if (!clip)
			throw {
				name: '404',
				description: 'Could not find clip.',
			};

		return res.json(clip);
	} catch (error) {
		return res.status(404).json({ error });
	}
});

router.get('/:slug/watch', async (req, res) => {
	const { slug } = req.params;

	try {
		const clip = await Clip.findOne({
			where: { slug },
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

		return res.sendFile(resolve(CLIPS_DIR, clip.slug + '.mp4'));
	} catch (error) {
		return res.status(400).json({ error });
	}
});

router.get('/:slug/oembed', async (req, res) => {
	const { slug } = req.params;

	try {
		const clip = await Clip.findOne({
			where: { slug },
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

		return res.json({
			title: clip.name,
			provider_name: 'Clipping Service',
			provider_url: process.env.FRONTEND_URL,
			author_name: `Clip - ${clip.name}`,
			author_url: `${process.env.FRONTEND_URL}/clip/${clip.slug}`,
			html: `<iframe width="200" height="113" src="http://clips.granbohm.dev/api/clips/${clip.slug}/watch" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
		});
	} catch (error) {
		return res.status(400).json({ error });
	}
});

export default router;
