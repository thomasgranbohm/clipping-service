import { Router } from 'express';
import { Clip } from '../database/models/Clip';
import { Episode } from '../database/models/Episode';
import { Season } from '../database/models/Season';
import { Show } from '../database/models/Show';

const router = Router();

router.get('/', async (req, res) => {
	const shows = await Show.findAll({});

	return res.json(shows);
});

router.get('/:showSlug', async (req, res) => {
	const { showSlug } = req.params;

	try {
		const show = await Show.findOne({
			where: { slug: showSlug },
			include: [
				{ model: Season, include: [{ model: Episode, include: [Clip] }] },
			],
		});

		return res.json(show);
	} catch (error) {
		console.log(error);
		return res.json({
			error: {
				name: 'An error occurred.',
			},
		});
	}
});

router.get('/:showSlug/:seasonSlug', async (req, res) => {
	const { seasonSlug, showSlug } = req.params;

	try {
		const season = await Season.findOne({
			where: { slug: seasonSlug },
			include: [
				{
					model: Show,
					where: { slug: showSlug },
				},
				{ model: Episode, include: [Clip] },
			],
		});

		return res.json(season);
	} catch (error) {
		return res.json({
			error,
		});
	}
});

router.get('/:showSlug/:seasonSlug/:episodeSlug', async (req, res) => {
	const { episodeSlug, seasonSlug, showSlug } = req.params;

	try {
		const episode = await Episode.findOne({
			where: { slug: episodeSlug },
			include: [
				{
					model: Show,
					where: { slug: showSlug },
				},
				{
					model: Season,
					where: { slug: seasonSlug },
				},
				Clip,
			],
		});

		return res.json(episode);
	} catch (error) {
		return res.json({ error });
	}
});

export default router;
