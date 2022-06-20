import { forwardRef } from 'react';
import { addToURL } from 'utils/functions';
import classes from './Video.module.scss';

type VideoProps = {
	url: URL;
};

// eslint-disable-next-line react/display-name
const Video = forwardRef<HTMLVideoElement, VideoProps>(({ url }, videoRef) => (
	<video
		className={classes['container']}
		playsInline
		ref={videoRef}
		poster={addToURL(url, 'thumbnail').href}
		controls
	>
		<source src={addToURL(url, 'watch').href} />
		<p>Your browser does not support HTML5 video.</p>
	</video>
));

export default Video;
