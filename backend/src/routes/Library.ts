import { Router } from 'express';
import { Library } from 'database/models/Library';
import { Show } from 'database/models/Show';
import DatabaseLimit from 'middlewares/DatabaseLimit';
import { BaseModel } from 'database/models/BaseModel';

const router = Router();

router.get('/', DatabaseLimit, async (req, res) => {
	const { limit, offset } = req;
	const [items, total] = await Promise.all([
		Library.findAll({
			limit,
			offset,
			order: [['title', 'ASC']],
		}),
		Library.count(),
	]);

	return res.json({ items, offset, total, type: 'library' });
});

router.get('/:slug', async (req, res) => {
	const slug = req.params.slug as string;

	const library = await Library.findOne({ where: { slug } });

	return res.json(library);
});

router.get('/:slug/shows', DatabaseLimit, async (req, res) => {
	const { limit, offset } = req;
	const slug = req.params.slug as string;

	const { id } = await Library.findOne({ where: { slug }, attributes: ['id'] });

	const [items, total] = await Promise.all([
		Show.findAll({
			limit,
			offset,
			order: [['title', 'ASC']],
			where: { libraryId: id },
		}),
		Show.count({ where: { libraryId: id } }),
	]);

	return res.json({ offset, items, total, type: 'show' });
});

router.get('/:id/shows/:showId', async (req, res) =>
	res.redirect(`/shows/${req.params.showId}`)
);

export default router;
