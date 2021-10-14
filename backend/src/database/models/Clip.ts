import {
	AfterCreate,
	AllowNull,
	BeforeCreate,
	BeforeDestroy,
	BeforeUpdate,
	BelongsTo,
	Column,
	ForeignKey,
	Model,
	Table,
	Unique,
} from 'sequelize-typescript';
import slugify from 'slugify';
import { Episode } from './Episode';
import { Season } from './Season';
import { Show } from './Show';

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

	@ForeignKey(() => Episode)
	@Column
	episodeId: number;

	@BelongsTo(() => Episode)
	episode: Episode;

	@ForeignKey(() => Season)
	@Column
	seasonId: number;

	@BelongsTo(() => Season)
	season: Season;

	@ForeignKey(() => Show)
	@Column
	showId: number;

	@BelongsTo(() => Show)
	show: Show;

	@AfterCreate
	static startFFmpeg(instance: Clip) {
		console.log(
			'Start FFmpeg here! Start: %d. End: %d',
			instance.start,
			instance.end
		);
	}

	@BeforeDestroy
	static removeClip(instance: Clip) {
		console.log('Remove clip from file system with id %d.', instance.id);
	}
}
