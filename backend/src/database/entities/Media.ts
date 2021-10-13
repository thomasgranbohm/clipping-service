import { BaseEntity, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Clip } from './Clip';

@Entity()
export class Media extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToMany(() => Clip, (clip) => clip.media)
	clips: Clip[];
}
