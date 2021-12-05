import { Router } from 'express';
import { Includeable } from 'sequelize/types';
import { Library } from '../database/models/Library';
import { Show } from '../database/models/Show';
import { getNextUrl } from '../functions';
import DatabaseLimit from '../middlewares/DatabaseLimit';

const router = Router();

export const getLibraryWhereOptions = (library: any): Includeable => {
	return {
		model: Library.scope('stripped'),
		required: true,
		...(library ? { where: { slug: library.toString() } } : {}),
	};
};

router.get('/', DatabaseLimit, async (req, res, next) => {
	const { limit, offset } = req;
	try {
		const [items, total] = await Promise.all([
			Library.findAll({
				limit,
				offset,
				order: [['title', 'ASC']],
			}),
			Library.count(),
		]);

		return res.json({
			items,
			next: getNextUrl(req, items.length),
			total,
			type: 'library',
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
	const slug = req.params.slug as string;

	try {
		const library = await Library.findOne({ where: { slug } });

		if (!library)
			throw {
				status: 404,
				message: 'Library could not be found.',
			};

		return res.json(library);
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
	const { limit, offset } = req;
	const slug = req.params.slug as string;

	try {
		const [items, total] = await Promise.all([
			Show.findAll({
				limit,
				offset,
				order: [['title', 'ASC']],
				include: [getLibraryWhereOptions(slug)],
			}),
			Show.count({ include: [getLibraryWhereOptions(slug)] }),
		]);

		if (items.length === 0 && total === 0)
			throw {
				status: 404,
				message: 'No shows found in library.',
			};

		return res.json({
			next: getNextUrl(req, items.length),
			items,
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

router.get('/:id/items/:showId', async (req, res) =>
	res.redirect(`/shows/${req.params.showId}`)
);

export default router;
