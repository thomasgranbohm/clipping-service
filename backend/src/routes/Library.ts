import { Router } from 'express';
import { Library } from 'database/models/Library';
import { Show } from 'database/models/Show';
import DatabaseLimit from 'middlewares/DatabaseLimit';

const router = Router();

router.get('/', DatabaseLimit, async (req, res) => {
	const { limit, offset } = req;
	const [libraries, total] = await Promise.all([
		Library.findAll({
			limit,
			offset,
			order: [['title', 'ASC']],
		}),
		Library.count(),
	]);

	return res.json({ libraries, offset, total });
});

router.get('/:id', async (req, res) => {
	const id = parseInt(req.params.id);
	if (Number.isNaN(id))
		throw {
			status: 404,
		};

	const library = await Library.findOne({ where: { id: id } });

	return res.json({ library });
});

router.get('/:id/shows', DatabaseLimit, async (req, res) => {
	const id = parseInt(req.params.id);
	if (Number.isNaN(id))
		throw {
			status: 404,
		};

	const { limit, offset } = req;
	const [shows, total] = await Promise.all([
		Show.findAll({
			limit,
			offset,
			order: [['title', 'ASC']],
			where: { libraryId: id },
		}),
		Show.count({ where: { libraryId: id } }),
	]);

	return res.json({ offset, shows, total });
});

router.get('/:id/shows/:showId', async (req, res) =>
	res.redirect(`/shows/${req.params.showId}`)
);

export default router;
