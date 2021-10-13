import { BaseEntity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Season } from './Season';
import { Show } from './Show';

export class Episode extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToOne(() => Season, (season) => season.episodes)
	season: Season;

	@ManyToOne(() => Show, (show) => show.episodes)
	show: Show;
}
