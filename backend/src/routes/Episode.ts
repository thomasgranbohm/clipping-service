import { Router } from 'express';
import { Clip } from 'database/models/Clip';
import { Episode } from 'database/models/Episode';
import DatabaseLimit from 'middlewares/DatabaseLimit';
import { Season } from 'database/models/Season';
import { Show } from 'database/models/Show';

const router = Router();

router.get('/', DatabaseLimit, async (req, res) => {
	const { limit, offset } = req;
	const [items, total] = await Promise.all([
		Episode.findAll({
			limit,
			order: [['index', 'ASC']],
			offset,
		}),
		Episode.count(),
	]);

	return res.json({ items, offset, total, type: 'episode' });
});

router.get('/:showSlug/:seasonIndex/:episodeSlug', async (req, res) => {
	const { episodeSlug, seasonIndex, showSlug } = req.params;

	const episode = await Episode.findOne({
		where: { slug: episodeSlug },
		include: [
			{
				model: Season,
				where: { index: seasonIndex },
				attributes: ['index'],
				include: [
					{
						model: Show,
						where: { slug: showSlug },
						attributes: ['title'],
					},
				],
			},
		],
	});

	return res.json(episode);
});

router.get(
	'/:showSlug/:seasonIndex/:episodeSlug/clips',
	DatabaseLimit,
	async (req, res) => {
		const { limit, offset } = req;
		const { episodeSlug, seasonIndex, showSlug } = req.params;

		const where = {
			where: { slug: episodeSlug },
			include: [
				{
					model: Season,
					where: { index: seasonIndex },
					attributes: ['index'],
					include: [
						{
							model: Show,
							where: { slug: showSlug },
							attributes: ['title'],
						},
					],
				},
			],
		};

		const [items, total] = await Promise.all([
			Clip.findAll({
				limit,
				offset,
				include: [
					{
						model: Episode,
						...where,
					},
				],
			}),
			Clip.count({
				include: [
					{
						model: Episode,
						...where,
					},
				],
			}),
		]);

		return res.json({ items, offset, total, type: 'clip' });
	}
);

router.get('/:id/clips/:clipId', async (req, res) =>
	res.redirect(`/clips/${req.params.clipId}`)
);

export default router;
