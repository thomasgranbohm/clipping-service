import {
	BelongsTo,
	Column,
	ForeignKey,
	HasMany,
	Model,
	Table,
} from 'sequelize-typescript';
import { Episode } from './Episode';
import { Show } from './Show';

@Table
export class Season extends Model {
	@Column
	title!: string;

	@Column
	index!: number;

	@Column
	theme?: string;

	@Column
	thumb?: string;

	// Show
	@ForeignKey(() => Show)
	@Column
	showId: number;

	@BelongsTo(() => Show)
	show: Show;

	// Episodes
	@HasMany(() => Episode)
	episodes: Episode[];
}
