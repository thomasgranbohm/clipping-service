import fs, { readFile } from 'fs/promises';
import { resolve } from 'path';
import { Model, ModelCtor, Sequelize } from 'sequelize-typescript';
import { WhereOptions } from 'sequelize/types';
import { CLIPS_DIR, REVALIDATION_TIMEOUT } from '../constants';
import {
	getAllLibraries,
	getItemChildren,
	getItemDetails,
	getLibraryContents,
} from '../services/PlexAPI';
import { SeasonType, ShowType } from '../types';
import { DATABASE_CONFIG } from './config';
import { Clip } from './models/Clip';
import { Episode } from './models/Episode';
import { Library } from './models/Library';
import { Season } from './models/Season';
import { Show } from './models/Show';

export const connectToDatabase = () => new Sequelize(DATABASE_CONFIG);

export const revalidate = async () => {
	await syncAll();
	return setTimeout(revalidate, REVALIDATION_TIMEOUT);
};

export const reinitialize = async () => {
	await Episode.destroy({ where: {} });
	await Season.destroy({ where: {} });
	await Show.destroy({ where: {} });
	await Library.destroy({ where: {} });

	await syncAll();

	const clips = [];

	const rawClips = await fs.readdir(CLIPS_DIR);
	for (const clipFolder of rawClips.filter((f) => !f.startsWith('.'))) {
		try {
			const rawInformation = await readFile(
				resolve(CLIPS_DIR, clipFolder, 'information.b64'),
				{
					encoding: 'base64',
				}
			);
			const {
				createdAt,
				duration,
				end,
				episodeId,
				id,
				start,
				title,
				updatedAt,
			} = JSON.parse(Buffer.from(rawInformation, 'base64').toString('ascii'));

			if (
				[
					createdAt,
					duration,
					end,
					episodeId,
					id,
					start,
					title,
					updatedAt,
				].every((a) => !!a)
			) {
				throw new Error('Could not restore clip.');
			}

			clips.push({
				createdAt,
				duration,
				end,
				episodeId,
				id,
				start,
				title,
				updatedAt,
			});
		} catch (error) {
			console.log(
				"Information file corrupted or wrong. Could not restore '%s'.",
				clipFolder
			);
			console.log(error);
		}
	}
	try {
		await Clip.bulkCreate(
			clips.map(
				({ title, slug, start, end, episodeId, createdAt, updatedAt }) => ({
					title,
					slug,
					start,
					end,
					episodeId,
					createdAt,
					updatedAt,
				})
			)
		);
	} catch (error) {
		console.log('Could not restore clips from raw data.');
		console.log(error);
	}
};

const upsert = async <M extends Model>(
	CustomModel: ModelCtor<M>,
	values: M['_creationAttributes'],
	where: WhereOptions<M>
) => {
	const [amount, rows] = await CustomModel.update(
		{
			...where,
			...values,
		},
		{ where, returning: true }
	);
	if (amount === 0 || !rows) {
		const row = await CustomModel.create({
			...where,
			...values,
		});
		return row;
	} else {
		return rows[0];
	}
};

export const syncAll = async () => {
	console.time('Synced');
	const libraries = await getAllLibraries();

	for await (const { libraryId } of libraries) {
		const { items: shows, libraryTitle } = await getLibraryContents(libraryId);

		const library = await upsert<Library>(
			Library,
			{
				id: libraryId,
				title: libraryTitle,
				type: 'show',
			},
			{
				id: libraryId,
			}
		);

		for await (const { showId } of shows) {
			const {
				items: seasons,
				showTheme,
				showThumb,
				showTitle,
				summary,
			} = (await getItemChildren(showId)) as ShowType;

			const show = await upsert<Show>(
				Show,
				{
					id: showId,
					libraryId: library.id,
					summary,
					title: showTitle,
					theme: showTheme,
					thumb: showThumb,
				},
				{
					id: showId,
				}
			);

			for await (const { index: seasonIndex, seasonId } of seasons) {
				const {
					items: episodes,
					seasonTheme,
					seasonThumb,
					seasonTitle,
				} = (await getItemChildren(seasonId)) as SeasonType;

				const season = await upsert<Season>(
					Season,
					{
						id: seasonId,
						index: seasonIndex,
						showId: show.id,
						title: seasonTitle.length !== 0 ? seasonTitle : showTitle,
						theme: seasonTheme.length !== 0 ? seasonTheme : showTheme,
						thumb: seasonThumb.length !== 0 ? seasonThumb : showThumb,
					},
					{
						id: seasonId,
					}
				);

				for await (const { index: episodeIndex, episodeId } of episodes) {
					const { duration, episodeThumb, episodeTitle, filePath, summary } =
						await getItemDetails(episodeId);

					const episode = await upsert<Episode>(
						Episode,
						{
							id: episodeId,
							duration,
							filePath,
							index: episodeIndex,
							seasonId: season.id,
							summary,
							title: episodeTitle,
							thumb: episodeThumb,
						},
						{ id: episodeId }
					);
				}
			}
		}
	}
	console.timeEnd('Synced');
};
