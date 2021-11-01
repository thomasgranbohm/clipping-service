import { Request, Router } from 'express';
import { IncomingMessage } from 'http';
import { Op } from 'sequelize';
import { stream } from 'services/Streamer';
import { Clip } from 'database/models/Clip';
import { getItemChildren, getItemDetails, getMedia } from 'services/PlexAPI';

const router = Router();

router.get(`/:id`, async (req, res) => {
	const id = parseInt(req.params.id);
	const { filePath, ...details } = await getItemDetails(id);

	const clips = !req.query.paths
		? await Clip.findAll({
				where: {
					metadataKey: req.params.id,
					ready: true,
				},
		  })
		: [];

	return res.json({ details, clips });
});

router.get(`/:id/children`, async (req: Request, res) => {
	const id = parseInt(req.params.id);
	const details = await getItemChildren(id);

	const clips = !req.query.paths
		? await Clip.findAll({
				where: {
					[Op.or]: [
						{
							showKey: id,
						},
						{ seasonKey: id },
					],
					ready: true,
				},
		  })
		: [];

	return res.json({ details, clips });
});

router.get('/:id/watch', async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const { filePath } = await getItemDetails(id);

		return stream(req, res, filePath);
	} catch (error) {
		console.log(error);
		return res.status(400).json({ error });
	}
});

router.get('/:id/:type/:mediaId', async (req, res) => {
	const { id, mediaId, type } = req.params;

	if (!['thumb', 'art', 'theme'].includes(type))
		return res.status(400).json({ error: `${type} not allowed.` });

	const { data } = await getMedia(
		parseInt(id),
		parseInt(mediaId),
		type as 'thumb' | 'theme' | 'art'
	);
	(data as IncomingMessage).pipe(res);
});

router.use((err, req, res, next) => {
	console.log(err);
	res.status(501).send('Got error');
});

export default router;
