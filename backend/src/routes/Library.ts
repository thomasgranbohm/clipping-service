import { Router } from 'express';
import {
	getAllLibraries,
	getLibraryContents,
	getSpecificLibrary,
} from '../services/PlexAPI';

const router = Router();

router.get('/', async (req, res) => {
	const libs = await getAllLibraries();

	return res.json(libs);
});

router.get('/:id', async (req, res) => {
	const lib = await getSpecificLibrary(parseInt(req.params.id));

	return res.json(lib);
});

router.get('/:id/contents', async (req, res) => {
	const contents = await getLibraryContents(parseInt(req.params.id));

	return res.json(contents);
});

export default router;
