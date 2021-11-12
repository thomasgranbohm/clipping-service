import { Router } from 'express';
import { createReadStream } from 'fs';
import { Includeable } from 'sequelize/types';
import { Clip } from '../database/models/Clip';
import DatabaseLimit from '../middlewares/DatabaseLimit';
import { getItemDetails } from '../services/PlexAPI';
import { stream } from '../services/Streamer';
import { EPISODE_REQUIRED_ARGS, getEpisodeWhereOptions } from './Episode';

const router = Router();

export const getClipWhereOptions = (
	clip: any,
	...args: Parameters<typeof getEpisodeWhereOptions>
): Includeable => {
	return {
		attributes: [],
		model: Clip,
		where: { slug: clip.toString() },
		include: [getEpisodeWhereOptions(...args)],
	};
};

export const CLIP_REQUIRED_ARGS = ['season', ...EPISODE_REQUIRED_ARGS];

// router.use(MissingArgs(CLIP_REQUIRED_ARGS));

router.get('/', DatabaseLimit, async (req, res) => {
	const { limit, offset } = req;
	const { episode, library, season, show } = req.query;

	const [items, total] = await Promise.all([
		Clip.findAll({
			limit,
			offset,
			order: [['createdAt', 'DESC']],
			// include: [getEpisodeWhereOptions(episode, season, show, library)],
		}),
		Clip.count({
			// include: [getEpisodeWhereOptions(episode, season, show, library)],
		}),
	]);

	return res.json({ items, offset, total, type: 'clip' });
});

router.post('/', async (req, res) => {
	const { name, metadataKey, start, end } = req.body;

	try {
		const episode = await getItemDetails(metadataKey);

		if (episode.type !== 'episode' || !episode.episodeId)
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
			seasonId: episode.seasonId,
			showId: episode.showId,
			libraryId: episode.libraryId,
			seasonTitle: episode.seasonTitle,
			showTitle: episode.showTitle,
			libraryTitle: episode.libraryTitle,
		});

		return res.json(clip);
	} catch (error) {
		console.log(error);
		return res.status(400).json({ error });
	}
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;
	const { episode, library, season, show } = req.query;

	try {
		const clip = await Clip.findOne({
			where: { id },
			// include: [getEpisodeWhereOptions(episode, season, show, library)],
		});
		if (!clip)
			throw {
				name: 404,
				description: 'Could not find clip.',
			};
		else if (!clip.ready)
			throw {
				name: 400,
				description: 'File not ready yet.',
			};

		return res.json(clip);
	} catch (error) {
		return res.status(404).json({ error });
	}
});

router.delete('/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const clip = await Clip.findOne({ where: { id } });
		await clip.destroy();

		return res.json({ deleted: clip });
	} catch (error) {
		return res.status(404).json({ error });
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

		return stream(req, res, clip.getMediaPath());
	} catch (error) {
		return res.status(400).json({ error });
	}
});

router.get('/:id/download', async (req, res) => {
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

		res.setHeader(
			'Content-disposition',
			`attachment; filename=${clip.slug}.mp4`
		);
		res.setHeader('Content-type', 'video/mp4');

		const filestream = createReadStream(clip.getMediaPath());
		filestream.pipe(res);
	} catch (error) {
		console.error(error);
		return res.status(400).json({ error });
	}
});

router.get('/:id/thumbnail', async (req, res) => {
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

		return res.sendFile(clip.getThumbnailPath());
	} catch (error) {
		return res.status(400).json({ error });
	}
});

router.get('/:id/oembed', async (req, res) => {
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

		return res.json({
			version: '1.0',
			type: 'link',
			provider_name: 'Clipping Service',
			provider_url: process.env.FRONTEND_URL,
			thumbnail_height: 720,
			thumbnail_url: `${process.env.FRONTEND_URL}/api/clips/${clip.slug}/thumbnail`,
			thumbnail_width: 1200,
			width: 320,
			height: 200,
			html: `<iframe width="320" height="200" src="${process.env.FRONTEND_URL}/api/clips/${clip.slug}/watch" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
		});
	} catch (error) {
		return res.status(400).json({ error });
	}
});

export default router;
