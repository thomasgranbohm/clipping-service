import {
	BeforeCreate,
	BeforeUpdate,
	BelongsTo,
	Column,
	ForeignKey,
	HasMany,
	Model,
	Table,
} from 'sequelize-typescript';
import slugify from 'slugify';
import { Clip } from './Clip';
import { Season } from './Season';
import { Show } from './Show';

@Table
export class Episode extends Model {
	@Column
	name: string;

	@Column
	slug: string;

	@BeforeCreate
	@BeforeUpdate
	static createSlug(instance: Episode) {
		instance.slug = slugify(instance.name, { lower: true });
	}

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

	@HasMany(() => Clip)
	clips: Clip[];
}
