import {
	BeforeCreate,
	BeforeUpdate,
	Column,
	HasMany,
	Model,
	Table,
} from 'sequelize-typescript';
import slugify from 'slugify';
import { Clip } from './Clip';
import { Episode } from './Episode';
import { Season } from './Season';

@Table
export class Show extends Model {
	@Column
	name: string;

	@Column
	slug: string;

	@BeforeCreate
	@BeforeUpdate
	static createSlug(instance: Season) {
		instance.slug = slugify(instance.name, { lower: true });
	}

	@HasMany(() => Season)
	seasons: Season[];

	@HasMany(() => Episode)
	episodes: Episode[];

	@HasMany(() => Clip)
	clips: Clip[];
}
