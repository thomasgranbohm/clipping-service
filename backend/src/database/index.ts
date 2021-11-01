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
	console.log('Syncing all...');
	const libraries = await getAllLibraries();

	for (const { libraryId } of libraries) {
		const { items: shows, libraryTitle } = await getLibraryContents(libraryId);
		const createdLibrary = await Library.create({
			id: libraryId,
			title: libraryTitle,
			type: 'show',
		});

		for (const { showId } of shows) {
			const {
				items: seasons,
				showTheme,
				showThumb,
				showTitle,
				summary,
			} = (await getItemChildren(showId)) as ShowType;

			const createdShow = await Show.create({
				id: showId,
				library: createdLibrary,
				summary,
				title: showTitle,
				theme: showTheme,
				thumb: showThumb,
			});

			for (const { index: seasonIndex, seasonId } of seasons) {
				const {
					items: episodes,
					seasonTheme,
					seasonThumb,
					seasonTitle,
				} = (await getItemChildren(seasonId)) as SeasonType;

				const createdSeason = await Season.create({
					index: seasonIndex,
					show: createdShow,
					title: seasonTitle,
					theme: seasonTheme,
					thumb: seasonThumb,
				});

				for (const { index: episodeIndex, episodeId } of episodes) {
					const { duration, episodeThumb, episodeTitle, filePath, summary } =
						await getItemDetails(episodeId);

					const createdEpisode = await Episode.create({
						duration,
						filePath,
						index: episodeIndex,
						season: createdSeason,
						summary,
						title: episodeTitle,
						thumb: episodeThumb,
					});
				}
			}
		}
	}
	console.log('Done!');
};
