import { Column, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from './BaseModel';
import { Show } from './Show';

@Table
export class Library extends BaseModel {
	@Column
	type!: 'show';

	@HasMany(() => Show)
	shows: Show[];
}
