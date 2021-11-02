import { Clip } from 'database/models/Clip';
import { Episode } from 'database/models/Episode';
import { Library } from 'database/models/Library';
import { Season } from 'database/models/Season';
import { Show } from 'database/models/Show';
import { Router } from 'express';

const router = Router();

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
	return res.json({
		libraries: reduce(libraries, 'slug'),
	});
});

router.get('/shows', async (req, res) => {
	const shows = await Show.findAll({
		attributes: ['slug'],
	});

	return res.json({ shows: reduce(shows, 'slug') });
});

router.get('/seasons', async (req, res) => {
	const seasons = await Season.findAll({
		attributes: ['index', 'showId'],
	});

	return res.json({ seasons });
});

router.get('/episodes', async (req, res) => {
	const episodes = await Episode.findAll({
		attributes: ['slug'],
	});

	return res.json({ episodes: reduce(episodes, 'slug') });
});

router.get('/clips', async (req, res) => {
	const clips = await Clip.findAll({
		attributes: ['slug'],
	});

	return res.json({ clips: reduce(clips, 'slug') });
});

export default router;
