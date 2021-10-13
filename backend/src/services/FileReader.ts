import { Episode } from '../database/entities/Episode';
import { Movie } from '../database/entities/Movie';
import { Season } from '../database/entities/Season';
import { Show } from '../database/entities/Show';
import { promises as fs } from 'fs';
import { resolve } from 'path';

const MEDIA_DIR = resolve(process.cwd(), 'media');
const MOVIE_DIR = resolve(MEDIA_DIR, 'Movies');
const TV_SHOW_DIR = resolve(MEDIA_DIR, 'TV Shows');

const importMedia = async (media, type: 'movie' | 'tvshow') => {
	if (type === 'movie') {
		Movie.create({
			name: media,
		});
	} else if (type === 'tvshow') {
		if ((await Show.findOne({ where: { name: media } })) !== undefined)
			return console.log('Found %s', media);
		const show = await Show.create({
			name: media,
		});
		await show.save();

		const season_dirs = await fs.readdir(resolve(TV_SHOW_DIR, media));
		for (const season_dir of season_dirs) {
			if ((await Season.findOne({ where: { name: season_dir } })) !== undefined)
				return;
			const season = await Season.create({
				name: season_dir,
				show,
			});
			await season.save();

			const episode_files = await fs.readdir(
				resolve(TV_SHOW_DIR, media, season_dir)
			);
			for (const episode_name of episode_files) {
				if (
					(await Episode.findOne({ where: { name: episode_name } })) !==
					undefined
				)
					return;
				const episode = await Episode.create({
					name: episode_name,
					season,
					show,
				});

				await episode.save();
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
