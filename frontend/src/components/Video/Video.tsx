import { forwardRef, useEffect } from 'react';
import classes from './Video.module.scss';

type VideoProps = {
	identifier: string;
	type: 'clip' | 'episode';
	toggleFullscreen?: (e) => void;
};

const Video = forwardRef<HTMLVideoElement, VideoProps>(
	({ identifier, toggleFullscreen, type }, videoRef) => {
		const typeSpecificProps =
			type === 'clip'
				? {
						poster:
							type === 'clip' &&
							`${process.env.NEXT_PUBLIC_BACKEND_URL}/${type}/${identifier}/thumbnail`,
				  }
				: {};

		return (
			<video
				className={classes['container']}
				playsInline
				ref={videoRef}
				onDoubleClick={toggleFullscreen}
				{...typeSpecificProps}
			>
				<source
					src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${type}/${identifier}/watch`}
					type={'video/mp4'}
				/>
				<p>Your browser does not support HTML5 video.</p>
			</video>
		);
	}
);

export default Video;
