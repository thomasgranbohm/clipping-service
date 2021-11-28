import { revalidate, syncAll } from '../database';
import { Router } from 'express';

const router = Router();

router.post('/plex', (req, res) => {
	const { event } = req.body;
	if (!event) return res.status(400).send('Not OK');

	switch (event) {
		case 'library.new':
		case 'admin.database.backup':
			syncAll();
			break;
	}

	return res.status(200).send('OK');
});

export default router;
