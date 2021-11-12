import { Sequelize } from 'sequelize-typescript';
import { SeasonType, ShowType } from 'types';
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

export const syncAll = async () => {
	console.time('Synced');
	const libraries = await getAllLibraries();

	for await (const { libraryId } of libraries) {
		const { items: shows, libraryTitle } = await getLibraryContents(libraryId);
		const createdLibrary = await Library.create({
			id: libraryId,
			title: libraryTitle,
			type: 'show',
		});

		for await (const { showId } of shows) {
			const {
				items: seasons,
				showTheme,
				showThumb,
				showTitle,
				summary,
			} = (await getItemChildren(showId)) as ShowType;

			const createdShow = await Show.create({
				id: showId,
				libraryId: createdLibrary.id,
				summary,
				title: showTitle,
				theme: showTheme,
				thumb: showThumb,
			});

			for await (const { index: seasonIndex, seasonId } of seasons) {
				const {
					items: episodes,
					seasonTheme,
					seasonThumb,
					seasonTitle,
				} = (await getItemChildren(seasonId)) as SeasonType;

				const createdSeason = await Season.create({
					id: seasonId,
					index: seasonIndex,
					showId: createdShow.id,
					title: seasonTitle.length !== 0 ? seasonTitle : showTitle,
					theme: seasonTheme.length !== 0 ? seasonTheme : showTheme,
					thumb: seasonThumb.length !== 0 ? seasonThumb : showThumb,
				});

				for await (const { index: episodeIndex, episodeId } of episodes) {
					const { duration, episodeThumb, episodeTitle, filePath, summary } =
						await getItemDetails(episodeId);

					const createdEpisode = await Episode.create({
						id: episodeId,
						duration,
						filePath,
						index: episodeIndex,
						seasonId: createdSeason.id,
						summary,
						title: episodeTitle,
						thumb: episodeThumb,
					});
				}
			}
		}
	}
	console.timeEnd('Synced');
};
