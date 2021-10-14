import {
	BelongsTo,
	Column,
	ForeignKey,
	Model,
	Table,
} from 'sequelize-typescript';
import { Episode } from './Episode';

@Table
export class Clip extends Model {
	@Column
	name: string;

	@Column
	start: number;

	@Column
	end: number;

	@ForeignKey(() => Episode)
	@Column
	episodeId: number;

	@BelongsTo(() => Episode)
	episode: Episode;

	startFFmpeg() {
		console.log('Start FFmpeg here!');
	}

	removeClip() {
		console.log('Remove clip from file system with id %d.', 0);
	}
}
