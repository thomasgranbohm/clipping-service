import axios, { AxiosError } from 'axios';
import { resolve } from 'path';
import {
	Episode,
	Library,
	PlexId,
	Season,
	ShortEpisode,
	ShortLibrary,
	ShortSeason,
	ShortShow,
	Show
} from 'types';

const plex = axios.create({
	baseURL: `http://${process.env.PLEX_URL}`,
	params: {
		'X-Plex-Token': process.env.PLEX_TOKEN,
	},
});

const getMediaId = (str = '') => str.replace('/library/metadata/', '');

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

export const getAllLibraries = async (): Promise<ShortLibrary[]> => {
	const data = await requestPlex(`/library/sections`);

	const libraries = data['Directory']
		.filter((lib) => lib.type === 'show')
		.map(
			({ key, title }): ShortLibrary => ({
				libraryId: key,
				libraryTitle: title,
			})
		);

	return libraries;
};

export const getSpecificLibrary = async (id: PlexId) =>
	requestPlex(`/library/sections/${id}`);

export const getLibraryContents = async (id: PlexId): Promise<Library> => {
	const data = await requestPlex(`/library/sections/${id}/all`);

	const contents = data['Metadata'].map(
		({
			title,
			ratingKey,
			type,
			theme: showTheme,
			thumb: showThumb,
		}): ShortShow => ({
			showId: ratingKey,
			showTitle: title,
			type,
			showTheme: getMediaId(showTheme),
			showThumb: getMediaId(showThumb),
		})
	);

	return {
		libraryId: data['librarySectionID'],
		libraryTitle: data['librarySectionTitle'],
		items: contents,
	};
};

export const getItemDetails = async (id: PlexId) => {
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
		parentThumb: seasonThumb,
		grandparentTitle: showTitle,
		grandparentThumb: showThumb,
		grandparentTheme: showTheme,
		grandparentRatingKey: showId,
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
		filePath: new String(filePath).replace(
			'/mnt/harddrives/Plex Media',
			resolve(process.cwd(), 'media')
		),
		index,
		libraryId,
		libraryTitle,
		seasonArt: getMediaId(seasonArt),
		seasonId,
		seasonTitle,
		seasonThumb: getMediaId(seasonThumb),
		showId,
		showTitle,
		showTheme: getMediaId(showTheme),
		showThumb: getMediaId(showThumb),
		summary,
		type: 'episode',
	} as Episode;
};

export const getMedia = async (
	id: PlexId,
	mediaId: PlexId,
	type: 'thumb' | 'theme' | 'art'
) =>
	plex(`/library/metadata/${id}/${type}/${mediaId}`, {
		responseType: 'stream',
	});

export const getItemChildren = async (id: PlexId): Promise<Show | Season> => {
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
			showId: key,
			showTitle,
			summary,
			showArt: getMediaId(showArt),
			showTheme: getMediaId(showTheme),
			showThumb: getMediaId(showThumb),
			libraryId,
			libraryTitle,
			items: metadata.map(
				({ ratingKey, title, index, thumb }): ShortSeason => ({
					index,
					seasonId: ratingKey,
					seasonTitle: title,
					seasonThumb: getMediaId(thumb),
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
			seasonId: key,
			seasonTitle,
			seasonArt: getMediaId(seasonArt),
			seasonTheme: getMediaId(seasonTheme),
			seasonThumb: getMediaId(seasonThumb),
			showId,
			showTitle,
			showTheme: getMediaId(showTheme),
			showThumb: getMediaId(showThumb),
			libraryId,
			libraryTitle,
			items: metadata.map(
				({ ratingKey, type, title, index, thumb, art }): ShortEpisode => ({
					episodeArt: getMediaId(art),
					episodeId: ratingKey,
					episodeTitle: title,
					episodeThumb: getMediaId(thumb),
					index,
					type,
				})
			),
		} as Season;
	}

	return { ...data, viewGroup: 'none' };
};
