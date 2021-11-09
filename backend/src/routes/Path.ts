import { Clip } from 'database/models/Clip';
import { Episode } from 'database/models/Episode';
import { Library } from 'database/models/Library';
import { Season } from 'database/models/Season';
import { Show } from 'database/models/Show';
import { Router } from 'express';

const router = Router();

const toSeasonNumber = (n: number) => new String(n).padStart(2, '0');

const reduce = (items: any[], search: string) =>
	items.reduce((p, c) => [...p, c[search]], []);

router.get('/', async (req, res) => {
	console.log('Slash');

	return res.send('Paths');
});

router.get('/libraries', async (req, res) => {
	const libraries = await Library.findAll({
		attributes: ['slug'],
	});

	return res.json(libraries.map(({ slug }) => `/${slug}`));
});

router.get('/shows', async (req, res) => {
	const shows = await Show.findAll({
		attributes: ['id', 'slug'],
		include: [
			{
				model: Library,
				attributes: ['slug'],
			},
		],
	});

	return res.json(
		shows.map(({ slug: showSlug, library: { slug: librarySlug } }) => ({
			show: showSlug,
			library: librarySlug,
		}))
	);
});

router.get('/seasons', async (req, res) => {
	const seasons = await Season.findAll({
		attributes: ['index'],
		include: [
			{
				model: Show,
				attributes: ['slug'],
				include: [
					{
						model: Library,
						attributes: ['slug'],
					},
				],
			},
		],
	});

	return res.json(
		seasons.map(
			({
				index,
				show: {
					library: { slug: librarySlug },
					slug: showSlug,
				},
			}) => ({
				season: index.toString(),
				show: showSlug,
				library: librarySlug,
			})
		)
	);
});

router.get('/episodes', async (req, res) => {
	const episodes = await Episode.findAll({
		attributes: ['id', 'slug'],
		include: [
			{
				attributes: ['index'],
				model: Season,
				include: [
					{
						model: Show,
						attributes: ['slug'],
						include: [
							{
								model: Library,
								attributes: ['slug'],
							},
						],
					},
				],
			},
		],
	});

	return res.json(
		episodes.map(
			({
				slug: episodeSlug,
				season: {
					index,
					show: {
						library: { slug: librarySlug },
						slug: showSlug,
					},
				},
			}) => ({
				episode: episodeSlug,
				season: index.toString(),
				show: showSlug,
				library: librarySlug,
			})
		)
	);
});

router.get('/clips', async (req, res) => {
	const clips = await Clip.findAll({
		attributes: ['id', 'slug'],
	});

	return res.json({ clips });
});

export default router;
