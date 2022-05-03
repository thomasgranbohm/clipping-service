import { exec } from 'child_process';
import ffmpeg from 'ffmpeg-static';
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
		`"${filePath.replace('"', '\\"')}"`,
		'-ss',
		Math.min(BACKTRACK, clip.start).toFixed(4),
		'-t',
		(clip.end - clip.start).toFixed(4),
		'-ac',
		'2',
		'-map_chapters',
		'-1',
		'-y',
		CLIP_PATH,
	].join(' ');
	console.debug(cmd);
	console.time(`media-generation-${clip.slug}`);
	exec(cmd, (err, stdout, stderr) => {
		if (err) {
			console.log('Error while creating clip: %s', stderr);
			return Clip.destroy({ where: { id: clip.id } });
		}
		console.timeEnd(`media-generation-${clip.slug}`);
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
	console.time(`thumbnail-generation-${clip.slug}`);
	exec(cmd, (err, stdout, stderr) => {
		if (err) {
			console.log('Error while creating thumbnail: %s', stderr);
			return;
		}
		console.timeEnd(`thumbnail-generation-${clip.slug}`);
	});
};
