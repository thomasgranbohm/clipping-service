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
import { getItemDetails } from '../../services/PlexAPI';
import slugify from 'slugify';
import { resolve } from 'path';
import { exec } from 'child_process';
import ffmpeg from 'ffmpeg-static';

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
	metadataId: number;

	@AllowNull(false)
	@Column
	showId: number;

	@AllowNull(false)
	@Column
	seasonId: number;

	@AfterCreate
	static async startFFmpeg(instance: Clip) {
		const { filePath } = await getItemDetails(instance.metadataId);

		if (!filePath)
			return console.error(
				'Could not find file for id: %d',
				instance.metadataId
			);
		const cmd = [
			ffmpeg,
			'-i',
			`'${filePath}'`,
			'-ss',
			instance.start.toFixed(2),
			'-to',
			instance.end.toFixed(2),
			'-y',
			resolve(process.cwd(), 'clips', instance.slug + '.mp4'),
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
