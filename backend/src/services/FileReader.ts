import { Episode } from '../database/models/Episode';
// import { Movie } from '../database/models/Movie';
import { Season } from '../database/models/Season';
import { Show } from '../database/models/Show';
import { promises as fs } from 'fs';
import { resolve } from 'path';

const MEDIA_DIR = resolve(process.cwd(), 'media');
const MOVIE_DIR = resolve(MEDIA_DIR, 'Movies');
const TV_SHOW_DIR = resolve(MEDIA_DIR, 'TV Shows');

const importMedia = async (media, type: 'movie' | 'tvshow') => {
	if (type === 'movie') {
		// await Movie.create({
		// 	name: media,
		// });
	} else if (type === 'tvshow') {
		const [show] = await Show.findOrCreate({
			where: { name: media },
		});

		const season_dirs = await fs.readdir(resolve(TV_SHOW_DIR, media));
		for (const season_dir of season_dirs) {
			const [season] = await Season.findOrCreate({
				where: { name: season_dir, showId: show.id },
			});

			const episode_files = await fs.readdir(
				resolve(TV_SHOW_DIR, media, season_dir)
			);
			for (const episode_name of episode_files) {
				await Episode.findOrCreate({
					where: {
						name: episode_name,
						seasonId: season.id,
						showId: show.id,
					},
				});
			}
		}
	}
};

export const scanMedia = async () => {
	const [movies, tv_shows] = await Promise.all([
		await fs.readdir(MOVIE_DIR),
		await fs.readdir(TV_SHOW_DIR),
	]);

	for (const movie of movies) {
		await importMedia(movie, 'movie');
	}

	for (const tv_show of tv_shows) {
		await importMedia(tv_show, 'tvshow');
	}

	return { movies, tv_shows };
};
