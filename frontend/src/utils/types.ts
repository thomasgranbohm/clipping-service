export type Library = {
	slug: string;
	title: string;
};
export type Show = {
	slug: string;
	title: string;
	library: Library;
};
export type Season = {
	index: number;
	show: Show;
};
export type Episode = {
	title: string;
	slug: string;
	season: Season;
};

export type JointBreadcrumbType = Library | Show | Season | Episode;
export type BreadcrumbData = {
	href: string;
	title: string;
};
