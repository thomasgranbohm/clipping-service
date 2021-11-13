import { Library } from '../database/models/Library';
import { Show } from '../database/models/Show';
import { Router } from 'express';
import DatabaseLimit from '../middlewares/DatabaseLimit';
import { Includeable } from 'sequelize/types';

const router = Router();

export const getLibraryWhereOptions = (library: any): Includeable => {
	return {
		model: Library.scope('stripped'),
		where: { slug: library.toString() },
	};
};

router.get('/', DatabaseLimit, async (req, res) => {
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

		return res.json({ items, offset, total, type: 'library' });
	} catch (error) {
		res.status(400).json({
			status: 400,
			message: error.toString(),
		});
	}
});

router.get('/:slug', async (req, res) => {
	const slug = req.params.slug as string;

	try {
		const library = await Library.findOne({ where: { slug } });

		return res.json(library);
	} catch (error) {
		res.status(400).json({
			status: 400,
			message: error.toString(),
		});
	}
});

router.get('/:slug/items', DatabaseLimit, async (req, res) => {
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

		return res.json({ offset, items, total, type: 'show' });
	} catch (error) {
		res.status(400).json({
			status: 400,
			message: error.toString(),
		});
	}
});

router.get('/:id/items/:showId', async (req, res) =>
	res.redirect(`/shows/${req.params.showId}`)
);

export default router;
