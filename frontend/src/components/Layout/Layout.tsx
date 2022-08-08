import Anchor from 'components/Anchor/Anchor';
import Breadcrumbs, { Breadcrumb } from 'components/Breadcrumb/Breadcrumb';
import { FC, ReactNode } from 'react';
import { flattenLinks } from 'utils/functions';
import { JointBreadcrumbType } from 'utils/types';
import classes from './Layout.module.scss';

type LayoutProps = {
	children?: ReactNode;
	links?: JointBreadcrumbType;
};

const Layout: FC<LayoutProps> = ({ children, links }) => {
	const flattenedLinks = flattenLinks(links);

	return (
		<div className={classes['container']}>
			<header>
				{flattenedLinks.length > 1 && (
					<Breadcrumbs>
						{flattenedLinks.map(({ title, ...props }, i, arr) => (
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
				<p>
					<Anchor href={'https://github.com/thomasgranbohm/clipping-service'}>
						Source code
					</Anchor>{' '}
				</p>
				{process.env.NEXT_PUBLIC_GIT_COMMIT && (
					<p>
						Build:{' '}
						<Anchor
							href={`https://github.com/thomasgranbohm/clipping-service/commits/${process.env.NEXT_PUBLIC_GIT_COMMIT}`}
						>
							{process.env.NEXT_PUBLIC_GIT_COMMIT}
						</Anchor>
					</p>
				)}
			</footer>
		</div>
	);
};

export default Layout;
