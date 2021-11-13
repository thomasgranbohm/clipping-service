import Anchor from 'components/Anchor/Anchor';
import Breadcrumbs from 'components/Breadcrumb/Breadcrumb';
import { FC } from 'react';
import { flattenLinks } from 'utils/functions';
import { JointBreadcrumbType } from 'utils/types';
import classes from './Layout.module.scss';

type LayoutProps = {
	links?: JointBreadcrumbType;
};

const Layout: FC<LayoutProps> = ({ children, links, ...props }) => {
	const flattenedLinks = flattenLinks(links);
	const top = flattenedLinks.pop();

	return (
		<div className={classes['container']}>
			<header>
				<Breadcrumbs links={flattenedLinks} />
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
