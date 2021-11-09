import axios, { AxiosError } from 'axios';
import {
	EpisodeType,
	LibraryType,
	SeasonType,
	ShortEpisodeType,
	ShortLibraryType,
	ShortSeasonType,
	ShortShowType,
	ShowType,
} from 'types';

const plex = axios.create({
	baseURL: `http://${process.env.PLEX_URL}`,
	params: {
		'X-Plex-Token': process.env.PLEX_TOKEN,
	},
});

const getMediaId = (str = '') =>
	str.replace(/\/library\/metadata\/(.*?)\/(thumb|theme)\//g, '');

const toLowerCase = (obj: Object) =>
	Object.entries(obj)
		.map(([key, value]) => ({ [key.toLowerCase()]: value }))
		.reduce((prev, curr) => ({ ...prev, ...curr }), {});

const requestPlex = async (url) => {
	try {
		const resp = await plex(url);

		return resp.data['MediaContainer'];
	} catch (error) {
		if (error['isAxiosError'] === true) {
			const ae = error as AxiosError;
			throw {
				status: ae.response?.status || 500,
				data: ae.response?.data || 'Something went wrong',
			};
		}
		throw {
			status: 400,
		};
	}
};

export const getAllLibraries = async (): Promise<ShortLibraryType[]> => {
	const data = await requestPlex(`/library/sections`);

	const libraries = data['Directory']
		.filter((lib) => lib.type === 'show')
		.map(
			({ key, title }): ShortLibraryType => ({
				libraryId: key,
				libraryTitle: title,
			})
		);

	return libraries;
};

export const getSpecificLibrary = async (id: number) =>
	requestPlex(`/library/sections/${id}`);

export const getLibraryContents = async (id: number): Promise<LibraryType> => {
	const data = await requestPlex(`/library/sections/${id}/all`);

	const contents = data['Metadata'].map(
		({ title, ratingKey, type, theme, thumb }): ShortShowType => ({
			showId: parseInt(ratingKey),
			showTitle: title,
			type,
			showTheme: getMediaId(theme),
			showThumb: getMediaId(thumb),
		})
	);

	return {
		libraryId: parseInt(data['librarySectionID']),
		libraryTitle: data['librarySectionTitle'],
		items: contents,
	};
};

/**
 * Get episode
 * @param id
 */

export const getItemDetails = async (id: number) => {
	const data = await requestPlex(`/library/metadata/${id}`);

	const {
		Metadata: metadata,
		librarySectionTitle: libraryTitle,
		librarySectionID: libraryId,
	} = data;

	const {
		ratingKey,
		type,
		title: episodeTitle,
		parentArt: seasonArt,
		parentRatingKey: seasonId,
		parentTitle: seasonTitle,
		parentTheme: seasonTheme,
		parentThumb: seasonThumb,
		grandparentRatingKey: showId,
		grandparentTitle: showTitle,
		grandparentThumb: showThumb,
		grandparentTheme: showTheme,
		art,
		thumb,
		summary,
		index,
		Media,
	} = metadata.pop();

	if (type !== 'episode')
		throw {
			error: 400,
			description: `Type ${type} is not episode.`,
		};

	const { duration, Part } = Media.pop();
	const { file: filePath } = Part.pop();

	return {
		duration,
		episodeArt: getMediaId(art),
		episodeId: ratingKey,
		episodeThumb: getMediaId(thumb),
		episodeTitle,
		filePath: new String(filePath).replace('/mnt/harddrives/Plex Media', ''),
		index,
		libraryId: parseInt(libraryId),
		libraryTitle,
		seasonArt: getMediaId(seasonArt),
		seasonId: parseInt(seasonId),
		seasonTitle,
		seasonTheme: getMediaId(seasonTheme),
		seasonThumb: getMediaId(seasonThumb),
		showId: parseInt(showId),
		showTitle,
		showTheme: getMediaId(showTheme),
		showThumb: getMediaId(showThumb),
		summary,
		type: 'episode',
	} as EpisodeType;
};

export const getMedia = async (
	id: number,
	mediaId: number,
	type: 'thumb' | 'theme' | 'art'
) =>
	plex(`/library/metadata/${id}/${type}/${mediaId}`, {
		responseType: 'stream',
	});

/**
 * This is for getting a show or a season
 * @param id
 */
export const getItemChildren = async (
	id: number
): Promise<ShowType | SeasonType> => {
	const data = await requestPlex(`/library/metadata/${id}/children`);

	const { Metadata: metadata, key } = data;

	if (data.viewGroup === 'season') {
		// Show lookup
		const {
			parentTitle: showTitle,
			librarySectionTitle: libraryTitle,
			librarySectionID: libraryId,
			summary,
			art: showArt,
			theme: showTheme,
			thumb: showThumb,
		} = data;

		return {
			type: 'show',
			showId: parseInt(key),
			showTitle,
			summary,
			showArt: getMediaId(showArt),
			showTheme: getMediaId(showTheme),
			showThumb: getMediaId(showThumb),
			libraryId: parseInt(libraryId),
			libraryTitle,
			items: metadata.map(
				({ ratingKey, title, index, thumb, theme }): ShortSeasonType => ({
					index,
					seasonId: ratingKey,
					seasonTitle: title,
					seasonThumb: getMediaId(thumb),
					seasonTheme: getMediaId(theme),
					type: 'season',
				})
			),
		};
	} else if (data.viewGroup === 'episode') {
		// Season lookup
		const {
			grandparentTitle: showTitle,
			title2: seasonTitle,
			grandparentRatingKey: showId,
			librarySectionTitle: libraryTitle,
			librarySectionID: libraryId,
			art: seasonArt,
			theme: seasonTheme,
			thumb: seasonThumb,
			grandparentTheme: showTheme,
			grandparentThumb: showThumb,
		} = data;

		return {
			type: 'season',
			seasonId: parseInt(key),
			seasonTitle,
			seasonArt: getMediaId(seasonArt),
			seasonTheme: getMediaId(seasonTheme),
			seasonThumb: getMediaId(seasonThumb),
			showId: parseInt(showId),
			showTitle,
			showTheme: getMediaId(showTheme),
			showThumb: getMediaId(showThumb),
			libraryId: parseInt(libraryId),
			libraryTitle,
			items: metadata.map(
				({ ratingKey, type, title, index, thumb, art }): ShortEpisodeType => ({
					episodeArt: getMediaId(art),
					episodeId: parseInt(ratingKey),
					episodeTitle: title,
					episodeThumb: getMediaId(thumb),
					index,
					type,
				})
			),
		} as SeasonType;
	}

	return { ...data, viewGroup: 'none' };
};
