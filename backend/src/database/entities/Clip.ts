import {
	AfterInsert,
	BaseEntity,
	BeforeRemove,
	Column,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

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

	@AfterInsert()
	startFFmpeg() {
		console.log('Start FFmpeg here!');
	}

	@BeforeRemove()
	removeClip() {
		console.log('Remove clip from file system with id %d.', this.id);
	}
}
