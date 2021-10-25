import { HTMLAttributes } from 'react';
import { concat } from 'utils/functions';
import classes from './Icon.module.scss';

type IconProps = {
	type:
		| 'fullscreen'
		| 'fullscreen_exit'
		| 'play_arrow'
		| 'pause'
		| 'download'
		| 'clear'
		| 'add';
} & HTMLAttributes<HTMLElement>;

const Icon = ({ className, type, ...props }: IconProps) => (
	<span className={concat(classes['container'], className)} {...props}>
		{type}
	</span>
);

export default Icon;
