import { forwardRef, useState } from 'react';
import { concat } from 'utils/functions';
import classes from './ProgressBar.module.scss';

type ProgressBarProps = {
	setTimeFromProgress: (e: any) => void;
	time: number;
	className?: string;
};

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
	({ setTimeFromProgress, time, className }, progressRef) => {
		const [mouseDown, setMouseDown] = useState(false);

		// TODO: Release when mouse not over
		return (
			<div
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
			>
				<div
					className={classes['inner']}
					style={{
						width: Math.floor(100 * time).toFixed(4) + '%',
					}}
				></div>
			</div>
		);
	}
);

export default ProgressBar;
