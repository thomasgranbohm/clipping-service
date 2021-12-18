import Link, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes, forwardRef } from 'react';
import { concat } from 'utils/functions';
import classes from './Anchor.module.scss';

type AnchorProps = {
	href: string;
	noPrefetch?: boolean;
} & AnchorHTMLAttributes<HTMLAnchorElement> &
	LinkProps;

const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(
	({ children, className, href, noPrefetch, ...props }, ref) => (
		<Link href={href}>
			<a
				ref={ref}
				className={concat(classes['container'], className)}
				{...props}
			>
				{children}
			</a>
		</Link>
	)
);

export default Anchor;
