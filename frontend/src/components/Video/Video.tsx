import { useRouter } from 'next/dist/client/router';
import { forwardRef } from 'react';
import { addToURL, generateBackendURL } from 'utils/functions';
import classes from './Video.module.scss';

type VideoProps = {
	controls?: boolean;
	identifier: string;
	type: 'clip' | 'episode';
	toggleFullscreen?: (e) => void;
};

const Video = forwardRef<HTMLVideoElement, VideoProps>(
	({ controls, identifier, toggleFullscreen, type }, videoRef) => {
		const router = useRouter();
		const backendURL = generateBackendURL(router.asPath);

		return (
			<video
				className={classes['container']}
				playsInline
				ref={videoRef}
				onDoubleClick={toggleFullscreen}
				poster={addToURL(backendURL, 'thumbnail').href}
				controls={controls}
			>
				<source src={addToURL(backendURL, 'watch').href} type={'video/mp4'} />
				<p>Your browser does not support HTML5 video.</p>
			</video>
		);
	}
);

export default Video;
