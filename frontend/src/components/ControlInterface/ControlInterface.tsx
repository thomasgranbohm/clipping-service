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
		<Icon
			className={concat(classes['button'], classes['videoState'])}
			onClick={toggleVideoState}
			type={videoState ? 'pause' : 'play_arrow'}
		/>
		<Icon
			onClick={toggleFullscreen}
			type={fullscreen ? 'fullscreen_exit' : 'fullscreen'}
			className={concat(classes['button'], classes['fullscreen'])}
		/>
	</div>
);

export default ControlInterface;
