import { access, mkdir, rm } from 'fs/promises';
import { resolve } from 'path';
import {
	AfterCreate,
	AllowNull,
	BeforeBulkCreate,
	BeforeBulkDestroy,
	BeforeBulkUpdate,
	BeforeCreate,
	BeforeDestroy,
	BeforeUpdate,
	BelongsTo,
	Column,
	DataType,
	Default,
	ForeignKey,
	Model,
	Table,
	Unique,
} from 'sequelize-typescript';
import slugify from 'slugify';
import { CLIPS_DIR } from '../../constants';
import { generateClip } from '../../services/FFmpeg';
import { Episode } from './Episode';

@Table
export class Clip extends Model {
	@Unique
	@AllowNull(false)
	@Column
	title: string;

	@Unique
	@Column
	slug: string;

	@BeforeBulkCreate
	@BeforeBulkUpdate
	static beforeBulk(instances: Clip[]) {
		instances.forEach(Clip.createSlug);
	}

	@BeforeCreate
	@BeforeUpdate
	static createSlug(instance: Clip) {
		instance.title = instance.title.trim();
		if (!instance.slug) {
			instance.slug = slugify(instance.title, {
				lower: true,
				remove: /[^a-zA-Z0-9 -]/g,
				trim: true,
			});
		}
		instance.duration = instance.end - instance.start;
	}

	@AllowNull(false)
	@Column({
		type: DataType.DECIMAL,
	})
	start: number;

	@AllowNull(false)
	@Column({
		type: DataType.DECIMAL,
	})
	end: number;

	@Column({
		type: DataType.DECIMAL,
	})
	duration: number;

	@Default(false)
	@Column
	ready: boolean;

	// Episode
	@ForeignKey(() => Episode)
	@Column
	episodeId: number;

	@BelongsTo(() => Episode, { onDelete: 'SET NULL' })
	episode: Episode;

	@AfterCreate
	static async startFFmpeg(instance: Clip) {
		if (process.env.NODE_ENV !== 'production') return;

		const path = instance.getPath();
		try {
			await access(path);
		} catch (error) {
			console.log(
				instance.slug,
				(instance.slug = slugify(
					instance.title.replace(/[^a-zA-Z0-9 -]/g, ' ').trim(),
					{
						lower: true,
						remove: /[^a-zA-Z0-9 -]/g,
					}
				))
			);

			await mkdir(path);
			generateClip(instance);
		}
	}

	@BeforeDestroy
	static async removeClip(instance: Clip) {
		console.debug('Remove clip from file system with id %d.', instance.id);
		if (instance && instance.getPath) {
			await rm(instance.getPath(), { recursive: true, force: true });
		}
	}

	@BeforeBulkDestroy
	static async removeClips(instances: Clip[]) {
		await Promise.all(instances.map(Clip.removeClip));
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
