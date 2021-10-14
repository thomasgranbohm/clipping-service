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
import { Episode } from './Episode';
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
	static createSlug(instance: Episode) {
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
		console.log(
			'Start FFmpeg here! Start: %d. End: %d',
			instance.start,
			instance.end
		);

		const data = await getItemDetails(instance.metadataId);

		const filepath = data['Metadata'].pop()['Media'].pop()['Part'].pop().file;
		if (!filepath)
			return console.error(
				'Could not find file for id: %d',
				instance.metadataId
			);
		const cmd = [
			ffmpeg,
			'-i',
			`'${filepath}'`,
			'-ss',
			instance.start.toFixed(2),
			'-to',
			instance.end.toFixed(2),
			resolve(process.cwd(), 'clips', instance.slug + '.mp4'),
		].join(' ');
		exec(cmd, (err, stdout, stderr) => {
			if (err) return console.log('Should remove clip', stderr);
			instance.update({ ready: true });
		});
	}

	@BeforeDestroy
	static removeClip(instance: Clip) {
		console.log('Remove clip from file system with id %d.', instance.id);
	}
}
