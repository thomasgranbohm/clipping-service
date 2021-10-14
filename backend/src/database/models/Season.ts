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
import { Episode } from './Episode';
import { Show } from './Show';

@Table
export class Season extends Model {
	@Column
	name: string;

	@Column
	slug: string;

	@BeforeCreate
	@BeforeUpdate
	static createSlug(instance: Season) {
		instance.slug = slugify(instance.name, { lower: true });
	}

	@ForeignKey(() => Show)
	@Column
	showId: number;

	@BelongsTo(() => Show)
	show: Show;

	@HasMany(() => Episode)
	episodes: Episode[];
}
