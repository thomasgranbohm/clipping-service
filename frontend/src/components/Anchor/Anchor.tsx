import { AnchorHTMLAttributes, FC, HTMLAttributes } from 'react';
import { concat } from 'utils/functions';
import classes from './Anchor.module.scss';

type AnchorProps = {
	href: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

const Anchor: FC<AnchorProps> = ({ children, className, href, ...props }) => (
	<a href={href} className={concat(classes['container'], className)} {...props}>
		{children}
	</a>
);

export default Anchor;
