import { Clip } from 'database/models/Clip';
import { Episode } from 'database/models/Episode';
import { Library } from 'database/models/Library';
import { Season } from 'database/models/Season';
import { Show } from 'database/models/Show';
import { Request, Response, Router } from 'express';
import DatabaseLimit from 'middlewares/DatabaseLimit';

const router = Router();

/*

Query params:
?offset: item offset
?stripped: stripped version
?full: full version (default)
?items: boolean
*/

// /:library
// /:library/:show
// /:library/:show/:season
// /:library/:show/:season/:episode

class CustomRouter {
	getFull: (
		req: Request,
		res: Response
	) => Promise<Response<any, Record<string, any>>>;
	getStripped: (
		req: Request,
		res: Response
	) => Promise<Response<any, Record<string, any>>>;
	getItems: (
		req: Request,
		res: Response
	) => Promise<Response<any, Record<string, any>>>;

	get(req: Request, res: Response) {
		if ('stripped' in req.query) return this.getStripped(req, res);
		if ('items' in req.query) return this.getItems(req, res);
		else return this.getFull(req, res);
	}
}

const routerGet = (router: CustomRouter) => (req: Request, res: Response) => {
	if ('stripped' in req.query) return router.getStripped(req, res);
	if ('items' in req.query) return router.getItems(req, res);
	else return router.getFull(req, res);
};

class BaseRouter extends CustomRouter {
	getItems = async (req: Request, res: Response) => {
		const { limit, offset } = req;

		const [items, total] = await Promise.all([
			Library.scope('stripped').findAll({
				limit,
				offset,
				order: [['title', 'ASC']],
			}),
			Library.scope('stripped').count(),
		]);

		return res.json({ offset, items, total, type: 'library' });
	};
}
class LibraryRouter extends CustomRouter {
	getFull = async (req: Request, res: Response) => {
		const slug = req.params.library as string;

		const library = await Library.findOne({
			where: { slug },
		});

		return res.json(library);
	};
	getStripped = async (req: Request, res: Response) => {
		const slug = req.params.library as string;

		const library = await Library.scope('stripped').findOne({
			where: { slug },
		});

		return res.json(library);
	};
	getItems = async (req: Request, res: Response) => {
		const { limit, offset } = req;
		const { library } = req.params;

		const whereOptions = {
			include: [
				{
					model: Library,
					attributes: [],
					where: { slug: library },
				},
			],
		};

		const [items, total] = await Promise.all([
			Show.scope('stripped').findAll({
				limit,
				offset,
				order: [['title', 'ASC']],
				...whereOptions,
			}),
			Show.scope('stripped').count(whereOptions),
		]);

		return res.json({ offset, items, total, type: 'show' });
	};
}
class ShowRouter extends CustomRouter {
	getFull = async (req: Request, res: Response) => {
		const slug = req.params.show as string;

		const show = await Show.findOne({
			where: { slug },
		});

		return res.json(show);
	};
	getStripped = async (req: Request, res: Response) => {
		const slug = req.params.show as string;

		const show = await Show.scope('stripped').findOne({
			where: { slug },
		});

		return res.json(show);
	};
	getItems = async (req: Request, res: Response) => {
		const { limit, offset } = req;
		const slug = req.params.show as string;
		const { library } = req.params;

		const whereOptions = {
			include: [
				{
					model: Show,
					where: { slug },
					attributes: [],
					include: [
						{
							model: Library,
							where: { slug: library },
							attributes: [],
						},
					],
				},
			],
		};

		const [items, total] = await Promise.all([
			Season.findAll({
				limit,
				offset,
				order: [['index', 'ASC']],
				...whereOptions,
			}),
			Season.count(whereOptions),
		]);

		return res.json({ offset, items, total, type: 'season' });
	};
}
class SeasonRouter extends CustomRouter {
	getFull = async (req: Request, res: Response) => {
		const index = parseInt(req.params.season as string);

		const season = await Season.findOne({
			where: { index },
		});

		return res.json(season);
	};
	getStripped = async (req: Request, res: Response) => {
		const index = parseInt(req.params.season as string);

		const season = await Season.scope('stripped').findOne({
			where: { index },
		});

		return res.json(season);
	};
	getItems = async (req: Request, res: Response) => {
		const { limit, offset } = req;
		const index = parseInt(req.params.season as string);
		const { library, show } = req.params;

		const whereOptions = {
			include: [
				{
					model: Season,
					attributes: [],
					where: { index },

					include: [
						{
							model: Show,
							where: { slug: show },
							attributes: [],
							include: [
								{
									model: Library,
									where: { slug: library },
									attributes: [],
								},
							],
						},
					],
				},
			],
		};

		const [items, total] = await Promise.all([
			Episode.scope('stripped').findAll({
				limit,
				offset,
				order: [['index', 'ASC']],
				...whereOptions,
			}),
			Episode.scope('stripped').count(whereOptions),
		]);

		return res.json({ offset, items, total, type: 'episode' });
	};
}
class EpisodeRouter extends CustomRouter {
	getFull = async (req: Request, res: Response) => {
		const slug = req.params.episode as string;

		const episode = await Episode.findOne({
			where: { slug },
		});

		return res.json(episode);
	};
	getStripped = async (req: Request, res: Response) => {
		const slug = req.params.episode as string;

		const episode = await Episode.scope('stripped').findOne({
			where: { slug },
		});

		return res.json(episode);
	};
	getItems = async (req: Request, res: Response) => {
		const { limit, offset } = req;
		const slug = req.params.episode as string;
		const { library, show, season } = req.params;

		const whereOptions = {
			include: [
				{
					model: Episode,
					where: { slug },
					attributes: [],
					include: [
						{
							model: Season,
							attributes: [],
							where: { index: season },
							include: [
								{
									model: Show,
									attributes: [],
									where: { slug: show },
									include: [
										{
											model: Library,
											attributes: [],
											where: { slug: library },
										},
									],
								},
							],
						},
					],
				},
			],
		};

		const [items, total] = await Promise.all([
			Clip.findAll({
				limit,
				offset,
				order: [['title', 'ASC']],
				...whereOptions,
			}),
			Clip.count({
				...whereOptions,
			}),
		]);

		return res.json({ offset, items, total, type: 'clip' });
	};
}

router.use(DatabaseLimit);
router.get('/', routerGet(new BaseRouter()));
router.get('/:library', routerGet(new LibraryRouter()));
router.get('/:library/:show', routerGet(new ShowRouter()));
router.get('/:library/:show/:season', routerGet(new SeasonRouter()));
router.get('/:library/:show/:season/:episode', routerGet(new EpisodeRouter()));

export default router;
