import { Column, Entity, ManyToOne } from 'typeorm';
import { Media } from './Media';
import { Season } from './Season';
import { Show } from './Show';

@Entity()
export class Episode extends Media {
	@Column()
	name: string;

	@ManyToOne(() => Season, (season) => season.episodes)
	season: Season;

	@ManyToOne(() => Show, (show) => show.episodes)
	show: Show;
}
