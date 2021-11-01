import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	HasMany,
	Model,
	Table,
} from 'sequelize-typescript';
import { BaseModel } from './BaseModel';
import { Clip } from './Clip';
import { Season } from './Season';

@Table
export class Episode extends BaseModel {
	@Column
	index!: number;

	@Column
	thumb?: string;

	@Column
	duration!: number;

	@Column({ type: DataType.TEXT })
	filePath!: string;

	@Column({ type: DataType.TEXT })
	summary!: string;

	// Season
	@ForeignKey(() => Season)
	@Column
	seasonId: number;

	@BelongsTo(() => Season)
	season: Season;

	// Clips
	@HasMany(() => Clip)
	clips: Clip[];
}
