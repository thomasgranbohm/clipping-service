import Icon from 'components/Icon/Icon';
import { HTMLAttributes } from 'react';
import { concat } from 'utils/functions';
import classes from './ControlInterface.module.scss';

type ControlInterfaceProps = {
	fullscreen: boolean;
	toggleFullscreen: (e) => void;
	videoState: boolean;
	toggleVideoState: (e) => void;
} & HTMLAttributes<HTMLElement>;

const ControlInterface = ({
	fullscreen,
	toggleFullscreen,
	toggleVideoState,
	videoState,
	className,
}: ControlInterfaceProps) => (
	<div className={concat(classes['container'], className)}>
		<div className={classes['left']}>
			<Icon
				className={concat(classes['button'], classes['playOrPause'])}
				onClick={toggleVideoState}
				type={videoState ? 'pause' : 'play_arrow'}
			/>
		</div>
		<div className={classes['right']}>
			<Icon
				onClick={toggleFullscreen}
				type={fullscreen ? 'fullscreen_exit' : 'fullscreen'}
				className={classes['button']}
			/>
		</div>
	</div>
);

export default ControlInterface;
