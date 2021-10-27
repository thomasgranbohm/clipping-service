import Anchor from 'components/Anchor/Anchor';
import Breadcrumbs from 'components/Breadcrumb/Breadcrumb';
import { FC } from 'react';
import classes from './Layout.module.scss';

const Layout: FC = ({ children, ...props }) => {
	const links = [
		{
			href: '/',
			title: process.env.NEXT_PUBLIC_PAGE_TITLE,
		},
		props['libraryTitle'] && {
			href: `/library/${props['libraryKey']}`,
			title: props['libraryTitle'],
		},
		props['showTitle'] && {
			href: `/show/${props['showKey']}`,
			title: props['showTitle'],
		},
		props['seasonTitle'] && {
			href: `/season/${props['seasonKey']}`,
			title: props['seasonTitle'],
		},
		props['episodeTitle'] && {
			href: `/episode/${props['episodeKey']}`,
			title: props['episodeTitle'],
		},
		props['name'] &&
			props['slug'] && {
				href: `/clips/${props['slug']}`,
				title: props['name'],
			},
	].filter((link) => !!link);
	const top = links.pop();

	return (
		<div className={classes['container']}>
			<header>
				<Breadcrumbs links={links} />
				<h1>{top.title}</h1>
			</header>
			<article className={classes['content']}>{children}</article>
			<footer>
				<Anchor href={'https://github.com/thomasgranbohm/clipping-service'}>
					Source code
				</Anchor>
			</footer>
		</div>
	);
};

export default Layout;
