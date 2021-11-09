import { Column, HasMany, Scopes, Table } from 'sequelize-typescript';
import { BaseModel } from './BaseModel';
import { Show } from './Show';

@Scopes(() => ({
	stripped: {
		attributes: ['slug', 'title'],
	},
}))
@Table({
	timestamps: false,
})
export class Library extends BaseModel {
	@Column
	type!: 'show';

	@HasMany(() => Show)
	shows: Show[];
}
