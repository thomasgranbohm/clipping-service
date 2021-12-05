export type PlexId = number;

export type ShortLibraryType = {
	libraryId: number;
	libraryTitle: string;
};

export type LibraryType = {
	items: ShortShowType[];
} & ShortLibraryType;

export type ShortShowType = {
	showId: number;
	showTitle: string;
	showTheme: string;
	showThumb: string;
	type: 'show';
};

export type ShowType = ShortShowType &
	ShortLibraryType & {
		showArt: string;
		summary: string;
		items: ShortSeasonType[];
	};

export type ShortSeasonType = {
	index: number;
	seasonId: number;
	seasonTitle: string;
	seasonTheme: string;
	seasonThumb: string;
	type: 'season';
};

export type SeasonType = Omit<ShortSeasonType, 'index'> &
	Omit<ShortShowType, 'type'> &
	ShortLibraryType & {
		items: ShortEpisodeType[];
	};

export type ShortEpisodeType = {
	episodeArt: string;
	episodeId: number;
	episodeThumb: string;
	episodeTitle: string;
	index: string;
	type: 'episode';
};

export type EpisodeType = ShortEpisodeType &
	Omit<ShortSeasonType, 'type' | 'index'> &
	Omit<ShortShowType, 'type'> &
	ShortLibraryType & {
		duration: number;
		filePath: string;
		summary: string;
	};

export class CustomError extends Error {
	status: number;
	message: string;

	constructor({ status, message }) {
		super(message);

		this.status = status;
		this.message = message;
	}
}
