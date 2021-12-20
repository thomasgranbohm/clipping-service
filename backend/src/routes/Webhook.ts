import { Router } from 'express';
import { rmSync } from 'fs';
import multer from 'multer';
import { syncAll } from '../database';

const router = Router();
const upload = multer({ dest: '/tmp/' });

router.post('/plex', upload.single('thumb'), (req, res) => {
	if (!req.body.payload) return res.status(400).send('Not OK.');
	const body = JSON.parse(req.body.payload);
	const { event } = body;

	console.debug('Body', body);

	switch (event) {
		case 'library.new':
		case 'admin.database.backup':
			console.debug('Webhook triggered syncing!');
			syncAll();
			break;
		default:
			console.debug('Unrecognised event', event);
			break;
	}

	return res.status(200).send('OK');
});

export default router;
