import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	HasMany,
	Table,
} from 'sequelize-typescript';
import { BaseModel } from './BaseModel';
import { Library } from './Library';
import { Season } from './Season';

@Table
export class Show extends BaseModel {
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
