import { Router } from 'express';
import { Includeable } from 'sequelize/types';
import { Season } from '../database/models/Season';
import { Show } from '../database/models/Show';
import { getNextUrl } from '../functions';
import DatabaseLimit from '../middlewares/DatabaseLimit';
import MissingArgs from '../middlewares/MissingArgs';
import { getMedia } from '../services/PlexAPI';
import { CustomError } from '../types';
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

router.get('/', DatabaseLimit, async (req, res, next) => {
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

		if (items.length === 0 && total === 0)
			throw {
				status: 404,
				message: `No shows found in library.`,
			};

		return res.json({
			items,
			next: getNextUrl(req, items.length),
			total,
			type: 'show',
		});
	} catch (error) {
		next({
			status: error['status'] || 500,
			message: error['message'],
			stack: error['stack'],
			error,
		});
	}
});

router.get('/:slug', async (req, res, next) => {
	const { library } = req.query;
	const { slug } = req.params;

	try {
		const show = await Show.findOne({
			where: { slug },
			include: [getLibraryWhereOptions(library.toString())],
		});

		if (!show)
			throw {
				status: 404,
				message: 'Show not found in library.',
			};

		return res.json(show);
	} catch (error) {
		next({
			status: error['status'] || 500,
			message: error['message'],
			stack: error['stack'],
			error,
		});
	}
});

router.get('/:slug/items', DatabaseLimit, async (req, res, next) => {
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

		if (items.length === 0 && total === 0)
			throw {
				status: 404,
				message: 'No seasons found in show.',
			};

		return res.json({
			items,
			next: getNextUrl(req, items.length),
			total,
			type: 'season',
		});
	} catch (error) {
		next({
			status: error['status'] || 500,
			message: error['message'],
			stack: error['stack'],
			error,
		});
	}
});

router.get('/:slug/thumbnail', async (req, res, next) => {
	const { slug } = req.params;
	const { library } = req.query;

	try {
		const show = await Show.findOne({
			attributes: ['thumb'],
			where: { slug },
			include: [getLibraryWhereOptions(library)],
		});

		if (!show)
			throw new CustomError({
				status: 404,
				message: 'Show not found in library.',
			});

		const { thumb } = show;
		if (!thumb)
			throw new CustomError({
				status: 404,
				message: 'No thumbnail found for show.',
			});

		const { data } = await getMedia(thumb);

		data.pipe(res);
	} catch (error) {
		next({
			status: error['status'] || 500,
			message: error['message'],
			stack: error['stack'],
			error,
		});
	}
});

router.get('/:id/items/:seasonId', async (req, res) =>
	res.redirect(`/seasons/${req.params.seasonId}`)
);

export default router;
