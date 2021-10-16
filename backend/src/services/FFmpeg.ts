import { exec } from 'child_process';
import { Clip } from '../database/models/Clip';
import ffmpeg from 'ffmpeg-static';
import { getItemDetails } from './PlexAPI';

export const generateClip = async (clip: Clip) => {
	const { filePath } = await getItemDetails(clip.metadataKey);

	if (!filePath)
		return console.error('Could not find file for id: %d', clip.metadataKey);

	const CLIP_PATH = clip.getMediaPath();

	const cmd = [
		ffmpeg,
		'-i',
		`'${filePath}'`,
		'-ss',
		clip.start.toFixed(2),
		'-to',
		clip.end.toFixed(2),
		'-y',
		CLIP_PATH,
	].join(' ');
	exec(cmd, (err, stdout, stderr) => {
		if (err) {
			console.log('Error while creating clip: %s', stderr);
			return Clip.destroy({ where: { id: clip.id } });
		}
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
		clip.start.toFixed(2),
		'-vframes',
		'1',
		THUMBNAIL_PATH,
	].join(' ');
	exec(cmd, (err, stdout, stderr) => {
		if (err) {
			console.log('Error while creating thumbnail: %s', stderr);
			return;
		}
	});
};
