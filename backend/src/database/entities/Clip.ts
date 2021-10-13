import {
	AfterInsert,
	BaseEntity,
	BeforeRemove,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Media } from './Media';

@Entity()
export class Clip extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	start: number;

	@Column()
	end: number;

	@ManyToOne(() => Media, (media) => media.clips)
	media: Media;

	@AfterInsert()
	startFFmpeg() {
		console.log('Start FFmpeg here!');
	}

	@BeforeRemove()
	removeClip() {
		console.log('Remove clip from file system with id %d.', this.id);
	}
}
