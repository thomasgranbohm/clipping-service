import axios, { AxiosError } from 'axios';

const plex = axios.create({
	baseURL: `http://${process.env.PLEX_URL}`,
	params: {
		'X-Plex-Token': process.env.PLEX_TOKEN,
	},
});

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
			return {
				error: {
					status: ae.response.status,
					data: ae.response.data,
				},
			};
		}
		return {
			error: 400,
		};
	}
};

export const getAllLibraries = async () => requestPlex(`/library/sections`);

export const getSpecificLibrary = async (id: PlexId) =>
	requestPlex(`/library/sections/${id}`);

export const getLibraryContents = async (id: PlexId) =>
	requestPlex(`/library/sections/${id}/all`);

export const getItemDetails = async (id: PlexId) =>
	requestPlex(`/library/metadata/${id}`);

export const getItemChildren = async (id: PlexId) =>
	requestPlex(`/library/metadata/${id}/children`);
