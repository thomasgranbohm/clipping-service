import { FC } from 'react';
import classes from './Anchor.module.scss';

type AnchorProps = {
	href: string;
};

const Anchor: FC<AnchorProps> = ({ children, href }) => (
	<a href={href} className={classes['container']}>
		{children}
	</a>
);

export default Anchor;
