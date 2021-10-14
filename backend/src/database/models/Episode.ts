// import { exec } from 'child_process';
// import { resolve } from 'path';
import {
	BeforeCreate,
	BeforeUpdate,
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	HasMany,
	Model,
	Table
} from 'sequelize-typescript';
import slugify from 'slugify';
// import { promisify } from 'util';
import { Clip } from './Clip';
import { Season } from './Season';
import { Show } from './Show';

// const execWait = promisify(exec);

@Table
export class Episode extends Model {
	@Column
	name: string;

	@Column
	slug: string;

	@Column({
		type: DataType.FLOAT,
	})
	duration: number;

	@BeforeCreate
	@BeforeUpdate
	static async populate(instance: Episode) {
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
