import { mkdir, rm } from 'fs/promises';
import { resolve } from 'path';
import {
	AfterCreate,
	AllowNull,
	BeforeBulkDestroy,
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
import { generateClip } from '../../services/FFmpeg';

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

		await mkdir(instance.getPath());
		generateClip(instance);
	}

	@BeforeDestroy
	@BeforeBulkDestroy
	static async removeClip(instance: Clip) {
		console.debug('Remove clip from file system with id %d.', instance.id);
		if (instance) {
			await rm(instance.getPath(), { recursive: true, force: true });
		}
	}

	getPath() {
		return resolve(CLIPS_DIR, this.slug);
	}

	getMediaPath() {
		return resolve(this.getPath(), 'clip.mp4');
	}

	getThumbnailPath() {
		return resolve(this.getPath(), 'thumbnail.png');
	}
}
