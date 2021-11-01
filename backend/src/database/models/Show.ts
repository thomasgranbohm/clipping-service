import {
	BeforeCreate,
	BeforeUpdate,
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	HasMany,
	Model,
	Table,
} from 'sequelize-typescript';
import slugify from 'slugify';
import { BaseModel } from './BaseModel';
import { Library } from './Library';
import { Season } from './Season';

@Table
export class Show extends Model {
	@Column
	title!: string;

	@Column
	slug?: string;

	@BeforeCreate
	@BeforeUpdate
	static createSlug(instance: BaseModel) {
		instance.slug = slugify(instance.title, {
			lower: true,
			remove: /[*+~.()'"!:@]/g,
		});
	}

	@Column({ type: DataType.TEXT })
	summary!: string;

	@Column
	theme?: string;

	@Column
	thumb?: string;

	// Library
	@ForeignKey(() => Library)
	@Column
	libraryId: number;

	@BelongsTo(() => Library)
	library: Library;

	// Seasons
	@HasMany(() => Season)
	seasons: Season[];
}
