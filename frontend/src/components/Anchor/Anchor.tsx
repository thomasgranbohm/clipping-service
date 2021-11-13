import { AnchorHTMLAttributes, FC, HTMLAttributes } from 'react';
import { concat } from 'utils/functions';
import classes from './Anchor.module.scss';
import Link, { LinkProps } from 'next/link';

type AnchorProps = {
	href: string;
	noPrefetch?: boolean;
} & AnchorHTMLAttributes<HTMLAnchorElement> &
	LinkProps;

const Anchor: FC<AnchorProps> = ({
	children,
	className,
	href,
	noPrefetch,
	...props
}) => (
	<Link href={href}>
		<a className={concat(classes['container'], className)} {...props}>
			{children}
		</a>
	</Link>
);

export default Anchor;
