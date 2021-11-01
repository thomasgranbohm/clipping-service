export type PlexId = number | string;

export type ShortLibrary = {
	libraryId: PlexId;
	libraryTitle: string;
};

export type Library = {
	items: ShortShow[];
} & ShortLibrary;

export type ShortShow = {
	showId: PlexId;
	showTitle: string;
	showTheme: string;
	showThumb: string;
	type: 'show';
};

export type Show = ShortShow &
	ShortLibrary & {
		showArt: string;
		summary: string;
		items: ShortSeason[];
	};

export type ShortSeason = {
	index: number;
	seasonId: PlexId;
	seasonTitle: string;
	seasonThumb: string;
	type: 'season';
};

export type Season = Omit<ShortSeason, 'index'> &
	Omit<ShortShow, 'type'> &
	ShortLibrary & {
		items: ShortEpisode[];
	};

export type ShortEpisode = {
	episodeArt: string;
	episodeId: PlexId;
	episodeThumb: string;
	episodeTitle: string;
	index: string;
	type: 'episode';
};

export type Episode = ShortEpisode &
	Omit<ShortSeason, 'type' | 'index'> &
	Omit<ShortShow, 'type'> &
	ShortLibrary & {
		duration: number;
		filePath: string;
		summary: string;
	};
