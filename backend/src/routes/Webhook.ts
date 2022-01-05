import { Router } from 'express';
import multer from 'multer';
import { syncAll } from '../database';

const router = Router();
const upload = multer({ dest: process.cwd() + '/uploads' });

router.post('/plex', upload.single('thumb'), (req, res) => {
	const body = req.body.payload ? JSON.parse(req.body.payload) : req.body;

	const { event } = body;

	if (!event) return res.status(400).send('Not OK.');

	switch (event) {
		case 'library.new':
		case 'admin.database.backup':
			console.debug('Webhook triggered syncing!');
			syncAll();
			break;
	}

	return res.status(200).send('OK');
});

export default router;
