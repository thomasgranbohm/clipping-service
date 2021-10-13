import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Episode } from './Episode';
import { Season } from './Season';

@Entity()
export class Show extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@OneToMany(() => Season, (season) => season.show)
	seasons: Season[];

	@OneToMany(() => Episode, (episode) => episode.show)
	episodes: Episode[];
}
