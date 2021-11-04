import { AnchorHTMLAttributes, FC, HTMLAttributes } from 'react';
import { concat } from 'utils/functions';
import classes from './Anchor.module.scss';
import NextLink from 'next/link';

type AnchorProps = {
	href: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

const Anchor: FC<AnchorProps> = ({ children, className, href, ...props }) => (
	<NextLink href={href}>
		<a className={concat(classes['container'], className)} {...props}>
			{children}
		</a>
	</NextLink>
);

export default Anchor;
