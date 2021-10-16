import { Clip } from '../database/models/Clip';
import { Router } from 'express';
import { getItemChildren, getItemDetails } from '../services/PlexAPI';

import { Op } from 'sequelize';

const router = Router();

router.get(`/:id`, async (req, res) => {
	const id = parseInt(req.params.id);
	const { filePath, ...details } = await getItemDetails(id);

	const clips = await Clip.findAll({
		where: {
			metadataKey: req.params.id,
			ready: true,
		},
	});

	return res.json({ details, clips });
});

router.get(`/:id/children`, async (req, res) => {
	const id = parseInt(req.params.id);
	const details = await getItemChildren(id);

	const clips = await Clip.findAll({
		where: {
			[Op.or]: [
				{
					showKey: id,
				},
				{ seasonKey: id },
			],
			ready: true,
		},
	});

	return res.json({ details, clips });
});

export default router;
