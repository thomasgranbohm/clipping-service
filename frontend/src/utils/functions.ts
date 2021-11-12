import { BreadcrumbData, JointBreadcrumbType } from './types';

export const concat = (...classes: Array<string | [unknown, any] | unknown>) =>
	classes
		.map((c) => {
			if (typeof c === 'string') return c;
			if (typeof c !== 'object' || !Array.isArray(c)) return false;

			const [className, condition] = c;
			return !!condition ? className : false;
		})
		.filter((c) => !!c)
		.join(' ');

export const addToURL = (url: URL, endpoint): URL =>
	new URL(`${url.origin}${url.pathname}/${endpoint}${url.search}`);

export const generateBackendURL = (path: string): URL => {
	const queryNames = ['library', 'show', 'season', 'episode'];

	const slashes = path.replace(/^\//, '').split('/');
	const slug = slashes.pop();
	const endpoint = queryNames[slashes.length];

	const url = addToURL(
		new URL(process.env.NEXT_PUBLIC_BACKEND_URL),
		`${endpoint}/${slug}`
	);

	for (const i in slashes) {
		const slash = slashes[i];
		url.searchParams.append(queryNames[i], slash);
	}

	return url;
};

export const flattenLinks = (links?: JointBreadcrumbType): BreadcrumbData[] => {
	const parseLinks = (localLinks?: JointBreadcrumbType): BreadcrumbData[] => {
		if (localLinks === undefined) {
			return [{ href: '', title: process.env.NEXT_PUBLIC_PAGE_TITLE }];
		} else if ('season' in localLinks) {
			return [
				...parseLinks(localLinks.season),
				{ href: localLinks.slug, title: localLinks.title },
			];
		} else if ('show' in localLinks) {
			return [
				...parseLinks(localLinks.show),
				{
					href: localLinks.index.toString(),
					title: `Season ${localLinks.index.toString()}`,
				},
			];
		} else if ('library' in localLinks) {
			return [
				...parseLinks(localLinks.library),
				{ href: localLinks.slug, title: localLinks.title },
			];
		} else {
			return [
				...parseLinks(),
				{ href: localLinks.slug, title: localLinks.title },
			];
		}
	};
	return parseLinks(links).map(({ href, title }, i, arr) => ({
		href: `${arr
			.slice(0, i)
			.map((a) => a.href)
			.join('/')}/${href}`,
		title,
	}));
};
