import {
	BelongsTo,
	Column,
	DefaultScope,
	ForeignKey,
	HasMany,
	Model,
	Scopes,
	Table
} from 'sequelize-typescript';
import { Episode } from './Episode';
import { Show } from './Show';

@DefaultScope(() => ({
	include: [
		{
			model: Show.scope('stripped'),
		},
	],
}))
@Scopes(() => ({
	stripped: {
		attributes: ['index', 'title'],
	},
}))
@Table({
	timestamps: false,
})
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
