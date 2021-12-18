import {
	AriaBreadcrumbItemProps,
	AriaBreadcrumbsProps,
} from '@react-types/breadcrumbs';
import Anchor from 'components/Anchor/Anchor';
import { useRef } from 'react';
import { useBreadcrumbItem, useBreadcrumbs } from 'react-aria';
import classes from './Breadcrumb.module.scss';

type BreadcrumbProps = {
	href: string;
} & AriaBreadcrumbItemProps;

export const Breadcrumb = ({ href, ...props }: BreadcrumbProps) => {
	const ref = useRef<HTMLAnchorElement>(null);
	const { itemProps } = useBreadcrumbItem(props, ref);
	const { children, isCurrent } = props;

	return (
		<li className={classes['item']}>
			<Anchor {...itemProps} ref={ref} href={href}>
				{children}
			</Anchor>
			{!isCurrent && (
				<span aria-hidden className={classes['slash']}>
					/
				</span>
			)}
		</li>
	);
};

type BreadcrumbsProps = AriaBreadcrumbsProps<unknown>;

const Breadcrumbs = (props: BreadcrumbsProps) => {
	const { navProps } = useBreadcrumbs(props);
	const { children } = props;

	return (
		<nav aria-label="Breadcrumb" className={classes['container']} {...navProps}>
			<ol className={classes['list']}>{children}</ol>
		</nav>
	);
};
export default Breadcrumbs;
