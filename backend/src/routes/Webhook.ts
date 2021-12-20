import { Router } from 'express';
import multer from 'multer';
import { syncAll } from '../database';

const router = Router();
const upload = multer({ dest: '/tmp/' });

router.post('/plex', upload.single('thumb'), (req, res) => {
	const { event } = req.body;

	console.debug('Body', req.body);

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
