import { Model, ModelCtor, Sequelize } from 'sequelize-typescript';
import { WhereOptions } from 'sequelize/types';
import { SeasonType, ShowType } from 'types';
import { REVALIDATION_TIMEOUT } from '../constants';
import {
	getAllLibraries,
	getItemChildren,
	getItemDetails,
	getLibraryContents,
} from '../services/PlexAPI';
import { DATABASE_CONFIG } from './config';
import { Episode } from './models/Episode';
import { Library } from './models/Library';
import { Season } from './models/Season';
import { Show } from './models/Show';

export const connectToDatabase = () => new Sequelize(DATABASE_CONFIG);

export const revalidate = async () => {
	await syncAll();
	return setTimeout(revalidate, REVALIDATION_TIMEOUT);
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
