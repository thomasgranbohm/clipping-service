import { exec } from 'child_process';
import { createHash } from 'crypto';
import ffmpeg from 'ffmpeg-static';
import { format } from 'util';
import { Clip } from '../database/models/Clip';
import { Episode } from '../database/models/Episode';

const BACKTRACK = 5;

export const generateClip = async (clip: Clip) => {
	const { filePath } = await Episode.findOne({
		where: { id: clip.episodeId },
	});

	if (!filePath)
		return console.error('Could not find file for id: %d', clip.episodeId);

	const CLIP_PATH = clip.getMediaPath();

	const command = format(
		'%s -ss %d -i "%s" -ss %d -t %d -ac 2 -map_chapters -1 -y %s',
		ffmpeg,
		Math.max(clip.start - BACKTRACK, 0).toFixed(4),
		filePath.replace('"', '\\"'),
		Math.min(BACKTRACK, clip.start).toFixed(4),
		(clip.end - clip.start).toFixed(4),
		CLIP_PATH
	);

	const hash = createHash('sha256');
	hash.write(
		`${command}|${clip.duration}|${clip.start}|${clip.end}|${clip.slug}`
	);
	const generationHash = hash.digest('hex');

	if (generationHash !== clip.generationHash) {
		console.debug(command);
		console.time(`media-generation-${clip.slug}`);
		await new Promise((res, rej) =>
			exec(command, (err, stdout, stderr) => {
				if (err) {
					console.log('Error while creating clip: %s', stderr);
					return Clip.destroy({ where: { id: clip.id } });
				}
				res(true);
			})
		);
		console.timeEnd(`media-generation-${clip.slug}`);

		await generateThumbnail(clip);
		clip.update({ generationHash });
	}

	clip.update({ ready: true });
};

export const generateThumbnail = async (clip: Clip) => {
	const THUMBNAIL_PATH = clip.getThumbnailPath();

	const command = format(
		'"%s" -i "%s" -ss 0 -frames:v 1 -y "%s"',
		ffmpeg,
		clip.getMediaPath(),
		THUMBNAIL_PATH
	);
	console.debug(command);
	console.time(`thumbnail-generation-${clip.slug}`);
	await new Promise((res, rej) =>
		exec(command, (err, _, stderr) => {
			if (err) {
				console.log('Error while creating thumbnail: %s', stderr);
				return;
			}
			res(true);
		})
	);
	console.timeEnd(`thumbnail-generation-${clip.slug}`);
};

export default { generateClip, generateThumbnail };
