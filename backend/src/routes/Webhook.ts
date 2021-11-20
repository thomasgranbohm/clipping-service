import { revalidate } from 'database';
import { Router } from 'express';

const router = Router();

router.post('/plex', (req, res) => {
	const { event } = req.body;
	if (!event) return;

	switch (event) {
		case 'library.new':
		case 'admin.database.backup':
			revalidate();
			break;
	}

	return res.status(200).send('OK');
});

export default router;
