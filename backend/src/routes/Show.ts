import { Router } from 'express';
import { Includeable } from 'sequelize/types';
import { Season } from '../database/models/Season';
import { Show } from '../database/models/Show';
import { getNextUrl } from '../functions';
import DatabaseLimit from '../middlewares/DatabaseLimit';
import MissingArgs from '../middlewares/MissingArgs';
import { getMedia } from '../services/PlexAPI';
import { getLibraryWhereOptions as getLibraryWhereOptions } from './Library';

const router = Router();

export const SHOW_REQUIRED_ARGS = ['library'];
export const getShowWhereOptions = (
	show: any,
	...args: Parameters<typeof getLibraryWhereOptions>
): Includeable => {
	return {
		include: [getLibraryWhereOptions(...args)],
		model: Show.scope('stripped'),
		required: true,
		...(show ? { where: { slug: show.toString() } } : {}),
	};
};

router.use(MissingArgs(SHOW_REQUIRED_ARGS));

router.get('/', DatabaseLimit, async (req, res) => {
	const { limit, offset } = req;
	const { library } = req.query;

	try {
		const [items, total] = await Promise.all([
			Show.findAll({
				limit: limit,
				offset: offset,
				order: [['title', 'ASC']],
				include: [getLibraryWhereOptions(library.toString())],
			}),
			Show.count({
				include: [getLibraryWhereOptions(library.toString())],
			}),
		]);

		return res.json({
			items,
			next: getNextUrl(req, items.length),
			total,
			type: 'show',
		});
	} catch (error) {
		res.status(400).json({
			status: 400,
			message: error.toString(),
		});
	}
});

router.get('/:slug', async (req, res) => {
	const { library } = req.query;

	try {
		const show = await Show.findOne({
			where: { slug: req.params.slug },
			include: [getLibraryWhereOptions(library.toString())],
		});

		return res.json(show);
	} catch (error) {
		res.status(400).json({
			status: 400,
			message: error.toString(),
		});
	}
});

router.get('/:slug/items', DatabaseLimit, async (req, res) => {
	const { slug } = req.params;
	const library = req.query.library as string;
	const { limit, offset } = req;

	try {
		const [items, total] = await Promise.all([
			Season.scope('stripped').findAll({
				limit,
				offset,
				order: [['index', 'ASC']],
				include: [getShowWhereOptions(slug, library)],
			}),
			Season.scope('stripped').count({
				include: [getShowWhereOptions(slug, library)],
			}),
		]);

		return res.json({
			items,
			next: getNextUrl(req, items.length),
			total,
			type: 'season',
		});
	} catch (error) {
		res.status(400).json({
			status: 400,
			message: error.toString(),
		});
	}
});

router.get('/:slug/thumbnail', async (req, res) => {
	const { slug } = req.params;
	const { library } = req.query;

	try {
		const { thumb } = await Show.findOne({
			attributes: ['thumb'],
			where: { slug },
			include: [getLibraryWhereOptions(library)],
		});
		if (!thumb)
			throw {
				name: '404',
				description: 'Could not find show.',
			};

		const { data } = await getMedia(thumb);

		data.pipe(res);
	} catch (error) {
		console.log(error);
		return res.status(400).json({ error });
	}
});

router.get('/:id/items/:seasonId', async (req, res) =>
	res.redirect(`/seasons/${req.params.seasonId}`)
);

export default router;
