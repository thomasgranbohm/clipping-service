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

export const generateBackendURL = (path: string): URL => {
	const queryNames = ['library', 'show', 'season', 'episode'];

	const slashes = path.replace(/^\//, '').split('/');
	const slug = slashes.pop();
	const endpoint = queryNames[slashes.length];

	const url = new URL(
		`/${endpoint}/${slug}`,
		process.env.NEXT_PUBLIC_BACKEND_URL
	);

	for (const i in slashes) {
		const slash = slashes[i];
		url.searchParams.append(queryNames[i], slash);
	}

	return url;
};

export const flattenLinks = (links: JointBreadcrumbType): BreadcrumbData[] => {
	const parseLinks = (localLinks: JointBreadcrumbType): BreadcrumbData[] => {
		if ('season' in localLinks) {
			return [
				{ href: localLinks.slug, title: localLinks.title },
				...parseLinks(localLinks.season),
			];
		} else if ('show' in localLinks) {
			return [
				{
					href: localLinks.index.toString(),
					title: `Season ${localLinks.index.toString()}`,
				},
				...parseLinks(localLinks.show),
			];
		} else if ('library' in localLinks) {
			return [
				{ href: localLinks.slug, title: localLinks.title },
				...parseLinks(localLinks.library),
			];
		} else {
			return [{ href: localLinks.slug, title: localLinks.title }];
		}
	};

	// ah yes, understandable code.
	// its 01:27 and i need to sleep

	return [
		{ href: '/', title: process.env.NEXT_PUBLIC_PAGE_TITLE },
		...parseLinks(links).reverse(),
	].map(({ href, title }, i, arr) => ({
		href: `/${arr
			.slice(0, i)
			.map((a) => a.href)
			.join('/')}/${href}`,
		title,
	}));
};
