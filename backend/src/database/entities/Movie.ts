import { Column, Entity } from 'typeorm';
import { Media } from './Media';

@Entity()
export class Movie extends Media {
	@Column()
	name: string;
}
