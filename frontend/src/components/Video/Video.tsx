import classes from './Video.module.scss';

const Video = ({ slug, ready }) => {
	if (!ready)
		return (
			<div className={classes['container']}>
				<h1>Clip not ready yet</h1>
			</div>
		);

	return (
		<div className={classes['container']}>
			<video
				className={classes['video']}
				controls
				playsInline
				poster={`${process.env.NEXT_PUBLIC_BACKEND_URL}/clips/${slug}/thumbnail`}
			>
				<source
					src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/clips/${slug}/watch`}
					type={'video/mp4'}
				/>
				<p>Your browser does not support HTML5 video.</p>
			</video>
		</div>
	);
};

export default Video;
