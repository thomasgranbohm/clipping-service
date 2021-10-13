import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Episode } from './Episode';
import { Show } from './Show';

@Entity()
export class Season extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToOne(() => Show, (show) => show.seasons)
	show: Show;

	@OneToMany(() => Episode, (episode) => episode.season)
	episodes: Episode[];
}
