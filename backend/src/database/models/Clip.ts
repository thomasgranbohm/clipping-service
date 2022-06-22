import { v4 } from 'uuid';
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
	@PrimaryKey
	@Unique
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
		if (!instance.id) {
			instance.id = v4();
		}
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

	@Column
	generationHash: string;

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
				Clip.generateFiles(clip);
			} catch (error) {
				console.error(
					'Something went wrong trying to generate files for %s.',
					clip.title
				);
				console.error(error);
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
			const information = await open(instance.getInformationPath(), 'w');

			information.write(
				Buffer.from(JSON.stringify(instance.getInformation())).toString(
					'base64'
				)
			);

			information.close();
		}

		try {
			await access(instance.getMediaPath());
		} catch (error) {
			FFmpeg.generateClip(instance);
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

	getInformation() {
		const {
			createdAt,
			duration,
			end,
			episodeId,
			generationHash,
			id,
			start,
			title,
			updatedAt,
		} = this;

		return {
			createdAt,
			duration,
			end,
			episodeId,
			generationHash,
			id,
			start,
			title,
			updatedAt,
		};
	}

	getPath() {
		return resolve(CLIPS_DIR, this.slug);
	}

	getInformationPath() {
		return resolve(this.getPath(), 'information.b64');
	}

	getMediaPath() {
		return resolve(this.getPath(), 'clip.webm');
	}

	getThumbnailPath() {
		return resolve(this.getPath(), 'thumbnail.png');
	}
}
