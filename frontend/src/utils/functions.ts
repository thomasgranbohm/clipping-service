import { BreadcrumbData, JointBreadcrumbType } from './types';
import { ParsedUrlQuery } from 'querystring';

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
	new URL(
		`${url.origin}${url.pathname}${
			!endpoint.startsWith('/') && !url.pathname.endsWith('/') ? '/' : ''
		}${endpoint}${url.search}`.replace(/((?<!:)\/{2,})/, '/')
	);

export const generateBackendURL = (path: string, clip?: boolean): URL => {
	const queryNames = ['library', 'show', 'season', 'episode', 'clip'];

	const slashes = path.split('/').slice(1);
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

export const getURLParams = (params: ParsedUrlQuery) => {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params).slice()) {
		search.append(key, value.toString());
	}

	return search;
};

export const getURLFromModel = (links?: JointBreadcrumbType): string =>
	flattenLinks(links).pop().href;

export const flattenLinks = (links?: JointBreadcrumbType): BreadcrumbData[] => {
	const parseLinks = (localLinks?: JointBreadcrumbType): BreadcrumbData[] => {
		if (!!!localLinks) {
			return [{ href: '', title: process.env.NEXT_PUBLIC_PAGE_TITLE }];
		} else if ('episode' in localLinks) {
			return [
				...parseLinks(localLinks.episode),
				{
					href: localLinks.slug,
					title: localLinks.title,
				},
			];
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
