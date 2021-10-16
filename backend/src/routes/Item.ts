import { Clip } from '../database/models/Clip';
import { Router } from 'express';
import { getItemChildren, getItemDetails } from '../services/PlexAPI';

import { Op } from 'sequelize';

const router = Router();

router.get(`/:id`, async (req, res) => {
	const { filePath, ...details } = await getItemDetails(
		parseInt(req.params.id)
	);

	const clips = await Clip.findAll({
		where: {
			metadataKey: req.params.id,
			ready: true,
		},
	});

	return res.json({ details, clips });
});

router.get(`/:id/children`, async (req, res) => {
	const details = await getItemChildren(parseInt(req.params.id));

	const clips = await Clip.findAll({
		where: {
			[Op.or]: [
				{
					showKey: req.params.id,
				},
				{ seasonKey: req.params.id },
			],
			ready: true,
		},
	});

	return res.json({ details, clips });
});

export default router;
