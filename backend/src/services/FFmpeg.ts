import { exec } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import { resolve } from 'path';
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

	const cmd = [
		ffmpeg,

		'-ss',
		Math.max(clip.start - BACKTRACK, 0).toFixed(4),
		'-i',
		`'${filePath}'`,
		'-ss',
		BACKTRACK.toFixed(4),
		'-t',
		(clip.end - clip.start).toFixed(2),
		'-ac',
		'2',
		'-map_chapters',
		'-1',
		'-y',
		CLIP_PATH,
	].join(' ');
	console.debug(cmd);
	console.time('Media Generation');
	exec(cmd, (err, stdout, stderr) => {
		if (err) {
			console.log('Error while creating clip: %s', stderr);
			return Clip.destroy({ where: { id: clip.id } });
		}
		console.timeEnd('Media Generation');
		generateThumbnail(clip).then(() => clip.update({ ready: true }));
	});
};

export const generateThumbnail = async (clip: Clip) => {
	const THUMBNAIL_PATH = clip.getThumbnailPath();

	const cmd = [
		ffmpeg,
		'-i',
		clip.getMediaPath(),
		'-ss',
		'0',
		'-frames:v',
		'1',
		'-y',
		THUMBNAIL_PATH,
	].join(' ');
	console.debug(cmd);
	exec(cmd, (err, stdout, stderr) => {
		if (err) {
			console.log('Error while creating thumbnail: %s', stderr);
			return;
		}
	});
};
