import { forwardRef, useState } from 'react';
import { concat } from 'utils/functions';
import classes from './ProgressBar.module.scss';

type ProgressBarProps = {
	setTimeFromProgress: (e: any) => void;
	currentTime: number;
	duration: number;
	className?: string;
};

const ProgressBar = forwardRef<HTMLProgressElement, ProgressBarProps>(
	({ setTimeFromProgress, currentTime, duration, className }, progressRef) => {
		const [mouseDown, setMouseDown] = useState(false);

		// TODO: Release when mouse not over
		return (
			<progress
				ref={progressRef}
				className={concat(
					classes['container'],
					[classes['hovering'], mouseDown],
					className
				)}
				onClick={setTimeFromProgress}
				onMouseDown={() => setMouseDown(true)}
				onMouseUp={() => setMouseDown(false)}
				onMouseMove={(e) => mouseDown && setTimeFromProgress(e)}
				value={currentTime}
				max={duration}
			/>
		);
	}
);

export default ProgressBar;
