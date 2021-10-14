import { exec } from 'child_process';
import { resolve } from 'path';
import {
	AfterCreate,
	AllowNull,
	BeforeCreate,
	BeforeDestroy,
	BeforeUpdate,
	BelongsTo,
	Column,
	Default,
	ForeignKey,
	Model,
	Table,
	Unique,
} from 'sequelize-typescript';
import slugify from 'slugify';
import { Episode } from './Episode';
import { Season } from './Season';
import { Show } from './Show';

@Table
export class Clip extends Model {
	@Unique
	@AllowNull(false)
	@Column
	name: string;

	@Unique
	@Column
	slug: string;

	@BeforeCreate
	@BeforeUpdate
	static createSlug(instance: Episode) {
		instance.slug = slugify(instance.name, { lower: true });
	}

	@AllowNull(false)
	@Column
	start: number;

	@AllowNull(false)
	@Column
	end: number;

	@Default(false)
	@Column
	ready: boolean;

	@ForeignKey(() => Episode)
	@Column
	episodeId: number;

	@BelongsTo(() => Episode)
	episode: Episode;

	@ForeignKey(() => Season)
	@Column
	seasonId: number;

	@BelongsTo(() => Season)
	season: Season;

	@ForeignKey(() => Show)
	@Column
	showId: number;

	@BelongsTo(() => Show)
	show: Show;

	@AfterCreate
	static async startFFmpeg(instance: Clip) {
		console.log(
			'Start FFmpeg here! Start: %d. End: %d',
			instance.start,
			instance.end
		);
		const clip = await Clip.findOne({
			where: { id: instance.id },
			include: [Show, Episode, Season],
		});
		const cmd = [
			'ffmpeg',
			'-i',
			`'${resolve(
				process.cwd(),
				'media',
				'TV Shows',
				clip.show.name,
				clip.season.name,
				clip.episode.name
			)}'`,
			'-ss',
			instance.start.toFixed(2),
			'-to',
			instance.end.toFixed(2),
			resolve(process.cwd(), 'clips', instance.slug + '.mp4'),
		].join(' ');
		exec(cmd, (err, stdout, stderr) => {
			if (err) return console.log('Should remove clip', stderr);
			instance.update({ ready: true });
		});
	}

	@BeforeDestroy
	static removeClip(instance: Clip) {
		console.log('Remove clip from file system with id %d.', instance.id);
	}
}
