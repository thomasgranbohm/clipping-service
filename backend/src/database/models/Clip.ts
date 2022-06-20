import { access, mkdir, open, rm } from 'fs/promises';
import { resolve } from 'path';
import {
	AfterBulkCreate,
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
	IsUUID,
	Model,
	PrimaryKey,
	Table,
	Unique,
} from 'sequelize-typescript';
import slugify from 'slugify';
import { CLIPS_DIR } from '../../constants';
import FFmpeg from '../../services/FFmpeg';
import { Episode } from './Episode';

@Table
export class Clip extends Model {
	@IsUUID(4)
	@PrimaryKey
	@Column
	id: string;

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

	@AfterBulkCreate
	static async checkRegeneration(instances: Clip[]) {
		if (process.env.NODE_ENV !== 'production') return;

		for (const clip of instances) {
			try {
				await access(clip.getInformationPath());
				await access(clip.getMediaPath());
				await access(clip.getThumbnailPath());

				await clip.update({ ready: true });
			} catch (error) {
				await Clip.generateFiles(clip);
			}
		}
	}

	@AfterCreate
	static async generateFiles(instance: Clip) {
		if (process.env.NODE_ENV !== 'production') return;

		const path = instance.getPath();
		try {
			await access(path);
		} catch (error) {
			await mkdir(path);
		}

		try {
			await access(instance.getInformationPath());
		} catch (error) {
			const {
				createdAt,
				duration,
				end,
				episodeId,
				id,
				start,
				title,
				updatedAt,
			} = instance;

			const information = await open(instance.getInformationPath(), 'w');
			information.write(
				Buffer.from(
					JSON.stringify({
						createdAt,
						duration,
						end,
						episodeId,
						id,
						start,
						title,
						updatedAt,
					})
				).toString('base64')
			);
		}

		try {
			await access(instance.getMediaPath());
		} catch (error) {
			await FFmpeg.generateClip(instance);
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

	getInformationPath() {
		return resolve(this.getPath(), 'information');
	}

	getMediaPath() {
		return resolve(this.getPath(), 'clip');
	}

	getThumbnailPath() {
		return resolve(this.getPath(), 'thumbnail');
	}
}
