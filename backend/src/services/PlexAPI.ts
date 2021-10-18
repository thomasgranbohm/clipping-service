import axios, { AxiosError } from 'axios';
import { resolve } from 'path';
import { pipeline } from 'stream/promises';

const plex = axios.create({
	baseURL: `http://${process.env.PLEX_URL}`,
	params: {
		'X-Plex-Token': process.env.PLEX_TOKEN,
	},
});

const getMediaKey = (str = '') =>
	str.indexOf('/') !== -1 ? str.split('/').pop() : null;

const toLowerCase = (obj: Object) =>
	Object.entries(obj)
		.map(([key, value]) => ({ [key.toLowerCase()]: value }))
		.reduce((prev, curr) => ({ ...prev, ...curr }), {});

type PlexId = number | string;

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

export const getAllLibraries = async () => {
	const data = await requestPlex(`/library/sections`);

	const libraries = data['Directory']
		.filter((lib) => lib.type === 'show')
		.map(({ key, title, type }) => ({ key, title, type }));

	return libraries;
};

export const getSpecificLibrary = async (id: PlexId) =>
	requestPlex(`/library/sections/${id}`);

export const getLibraryContents = async (id: PlexId) => {
	const data = await requestPlex(`/library/sections/${id}/all`);

	const contents = data['Metadata'].map(
		({
			title,
			ratingKey,
			type,
			art: showArt,
			theme: showTheme,
			thumb: showThumb,
		}) => ({
			showKey: ratingKey,
			title,
			type,
			showArt: getMediaKey(showArt),
			showTheme: getMediaKey(showTheme),
			showThumb: getMediaKey(showThumb),
		})
	);

	return contents;
};

export const getItemDetails = async (id: PlexId) => {
	const data = await requestPlex(`/library/metadata/${id}`);

	const {
		Metadata: metadata,
		librarySectionTitle: libraryTitle,
		librarySectionID: libraryKey,
	} = data;

	const {
		ratingKey: key,
		type,
		title: episodeTitle,
		grandparentTitle: showTitle,
		parentTitle: seasonTitle,
		parentRatingKey: seasonKey,
		grandparentRatingKey: showKey,
		summary,
		index,
		Media,
	} = metadata.pop();

	if (type !== 'episode')
		return {
			error: 400,
			description: `Type ${type} is not episode.`,
		};

	const { duration, Part } = Media.pop();
	const { file: filePath } = Part.pop();

	return {
		index,
		key,
		episodeTitle,
		seasonKey,
		seasonTitle,
		showKey,
		showTitle,
		libraryKey,
		libraryTitle,
		summary,
		type,
		duration,
		filePath: new String(filePath).replace(
			'/mnt/harddrives/Plex Media',
			resolve(process.cwd(), 'media')
		),
	};
};

export const getMedia = async (
	id: PlexId,
	mediaId: PlexId,
	type: 'thumb' | 'theme' | 'art'
) =>
	plex(`/library/metadata/${id}/${type}/${mediaId}`, {
		responseType: 'stream',
	});

export const getItemChildren = async (id: PlexId) => {
	const data = await requestPlex(`/library/metadata/${id}/children`);

	const { Metadata: metadata, key } = data;

	if (data.viewGroup === 'season') {
		// Show lookup
		const {
			parentTitle: showTitle,
			librarySectionTitle: libraryTitle,
			librarySectionID: libraryKey,
			summary,
			art: showArt,
			theme: showTheme,
			thumb: showThumb,
		} = data;

		return {
			key,
			type: 'show',
			showTitle,
			libraryKey,
			libraryTitle,
			summary,
			showArt: getMediaKey(showArt),
			showTheme: getMediaKey(showTheme),
			showThumb: getMediaKey(showThumb),
			metadata: metadata.map(({ ratingKey, type, title, index }) => ({
				key: ratingKey,
				index,
				title,
				type,
			})),
		};
	} else if (data.viewGroup === 'episode') {
		// Season lookup
		const {
			grandparentTitle: showTitle,
			title2: seasonTitle,
			grandparentRatingKey: showKey,
			librarySectionTitle: libraryTitle,
			librarySectionID: libraryKey,
			art: seasonArt,
			theme: seasonTheme,
			thumb: seasonThumb,
			grandparentTheme: showTheme,
			grandparentThumb: showThumb,
		} = data;

		return {
			key,
			type: 'season',
			showTitle,
			showKey,
			seasonTitle,
			libraryKey,
			libraryTitle,
			seasonArt: getMediaKey(seasonArt),
			seasonTheme: getMediaKey(seasonTheme),
			seasonThumb: getMediaKey(seasonThumb),
			showTheme: getMediaKey(showTheme),
			showThumb: getMediaKey(showThumb),
			metadata: metadata.map(({ ratingKey, type, title, index }) => ({
				key: ratingKey,
				index,
				title,
				type,
			})),
		};
	}

	return { ...data, viewGroup: 'none' };
};
