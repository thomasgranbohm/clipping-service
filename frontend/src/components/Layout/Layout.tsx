import Anchor from 'components/Anchor/Anchor';
import Breadcrumbs, { Breadcrumb } from 'components/Breadcrumb/Breadcrumb';
import { FC } from 'react';
import { flattenLinks } from 'utils/functions';
import { JointBreadcrumbType } from 'utils/types';
import classes from './Layout.module.scss';

type LayoutProps = {
	links?: JointBreadcrumbType;
};

const Layout: FC<LayoutProps> = ({ children, links, ...props }) => {
	const flattenedLinks = flattenLinks(links);

	return (
		<div className={classes['container']}>
			<header>
				{flattenedLinks.length > 1 && (
					<Breadcrumbs>
						{flattenedLinks
							.slice(0, flattenedLinks.length - 1)
							.map(({ title, ...props }, i, arr) => (
								<Breadcrumb
									elementType="a"
									key={i}
									isCurrent={i === arr.length - 1}
									{...props}
								>
									{title}
								</Breadcrumb>
							))}
					</Breadcrumbs>
				)}
				<h1>{flattenedLinks.slice().pop().title}</h1>
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
