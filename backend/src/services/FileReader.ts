import { exec } from 'child_process';
import { promises as fs } from 'fs';
import { readdir, unlink } from 'fs/promises';
import { resolve } from 'path';
import { promisify } from 'util';
import { Episode } from '../database/models/Episode';
// import { Movie } from '../database/models/Movie';
import { Season } from '../database/models/Season';
import { Show } from '../database/models/Show';
import ffprobe from 'ffprobe-static';

const execWait = promisify(exec);

const MEDIA_DIR = resolve(process.cwd(), 'media');
const MOVIE_DIR = resolve(MEDIA_DIR, 'Movies');
const TV_SHOW_DIR = resolve(MEDIA_DIR, 'TV Shows');

const EXTENSIONS = ['mkv', 'mp4', 'avi'];

const importMedia = async (media, type: 'movie' | 'tvshow') => {
	if (type === 'movie') {
		// await Movie.create({
		// 	name: media,
		// });
	} else if (type === 'tvshow') {
		const [show] = await Show.findOrCreate({
			where: { name: media },
		});

		const season_dirs = await fs.readdir(resolve(TV_SHOW_DIR, media), {
			withFileTypes: true,
		});
		for (const season_info of season_dirs) {
			if (!season_info.isDirectory()) continue;
			const season_dir = season_info.name;

			const [season] = await Season.findOrCreate({
				where: { name: season_dir, showId: show.id },
			});

			const episode_files = await fs.readdir(
				resolve(TV_SHOW_DIR, media, season_dir)
			);
			for (const episode_name of episode_files) {
				if (!EXTENSIONS.includes(episode_name.split('.').pop().toLowerCase()))
					continue;
				const { stderr, stdout } = await execWait(
					[
						ffprobe.path,
						'-v error -print_format json -show_format',
						`"${resolve(
							process.cwd(),
							'media',
							'TV Shows',
							show.name,
							season.name,
							episode_name
						).replace(/(["$\\])/g, '\\$1')}"`,
					].join(' ')
				);
				if (stderr) throw stderr;

				const fileinfo = JSON.parse(stdout);

				await Episode.findOrCreate({
					where: {
						name: episode_name,
						seasonId: season.id,
						showId: show.id,
						duration: fileinfo?.format?.duration || 0,
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

	if (process.env.NODE_ENV !== 'production') {
		const clips = await readdir(resolve(process.cwd(), 'clips'));

		for (const clip of clips) {
			await unlink(resolve(process.cwd(), 'clips', clip));
		}
	}

	for (const movie of movies) {
		await importMedia(movie, 'movie');
	}

	for (const tv_show of tv_shows) {
		await importMedia(tv_show, 'tvshow');
	}

	return { movies, tv_shows };
};
