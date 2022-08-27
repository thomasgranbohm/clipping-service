import Anchor from 'components/Anchor/Anchor';
import Breadcrumbs, { Breadcrumb } from 'components/Breadcrumb/Breadcrumb';
import Button from 'components/Button/Button';
import { useRouter } from 'next/dist/client/router';
import { FC } from 'react';
import { flattenLinks } from 'utils/functions';
import { JointBreadcrumbType } from 'utils/types';
import classes from './Layout.module.scss';

type LayoutProps = {
	displayLoginButton?: boolean;
	links?: JointBreadcrumbType;
};

const Layout: FC<LayoutProps> = ({ children, displayLoginButton, links }) => {
	const flattenedLinks = flattenLinks(links);

	const router = useRouter();

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
				<div className={classes['title-container']}>
					<h1>{flattenedLinks.slice().pop().title}</h1>
					{displayLoginButton && (
						<Button type="login" href={`/login?redirect=${router.asPath}`}>
							Login
						</Button>
					)}
				</div>
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
