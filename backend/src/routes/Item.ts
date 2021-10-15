import { Router } from 'express';
import { getItemChildren, getItemDetails } from '../services/PlexAPI';

const router = Router();

router.get(`/:id`, async (req, res) => {
	const { filePath, ...details } = await getItemDetails(
		parseInt(req.params.id)
	);

	return res.json(details);
});

router.get(`/:id/children`, async (req, res) => {
	const details = await getItemChildren(parseInt(req.params.id));

	return res.json(details);
});

export default router;
