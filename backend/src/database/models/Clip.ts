import { exec } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import { mkdir } from 'fs/promises';
import { resolve } from 'path';
import {
	AfterCreate,
	AllowNull,
	BeforeCreate,
	BeforeDestroy,
	BeforeUpdate,
	Column,
	Default,
	Model,
	Table,
	Unique,
} from 'sequelize-typescript';
import slugify from 'slugify';
import { CLIPS_DIR } from '../../constants';
import { getItemDetails } from '../../services/PlexAPI';

@Table
export class Clip extends Model {
	@Unique
	@AllowNull(false)
	@Column
	name: string;

	@Unique
	@Column
	slug: string;

	@BeforeCreate
	@BeforeUpdate
	static createSlug(instance: Clip) {
		instance.slug = slugify(instance.name, { lower: true });
	}

	@AllowNull(false)
	@Column
	start: number;

	@AllowNull(false)
	@Column
	end: number;

	@Default(false)
	@Column
	ready: boolean;

	@AllowNull(false)
	@Column
	metadataKey: number;

	@AllowNull(false)
	@Column
	showKey: number;

	@AllowNull(false)
	@Column
	showTitle: string;

	@AllowNull(false)
	@Column
	seasonKey: number;

	@AllowNull(false)
	@Column
	seasonTitle: string;

	@AllowNull(false)
	@Column
	libraryKey: number;

	@AllowNull(false)
	@Column
	libraryTitle: string;

	@AfterCreate
	static async startFFmpeg(instance: Clip) {
		if (process.env.NODE_ENV !== 'production') return;
		const { filePath } = await getItemDetails(instance.metadataKey);

		if (!filePath)
			return console.error(
				'Could not find file for id: %d',
				instance.metadataKey
			);

		const CLIP_PATH = resolve(CLIPS_DIR, instance.slug + '.mp4');

		const cmd = [
			ffmpeg,
			'-i',
			`'${filePath}'`,
			'-ss',
			instance.start.toFixed(2),
			'-to',
			instance.end.toFixed(2),
			'-y',
			CLIP_PATH,
		].join(' ');
		exec(cmd, (err, stdout, stderr) => {
			if (err) {
				console.log('Error while running FFmpeg: %s', stderr);
				return Clip.destroy({ where: { id: instance.id } });
			}
			instance.update({ ready: true });
		});
	}

	@BeforeDestroy
	static removeClip(instance: Clip) {
		console.log('Remove clip from file system with id %d.', instance.id);
	}
}
