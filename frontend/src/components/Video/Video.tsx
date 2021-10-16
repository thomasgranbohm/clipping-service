import classes from './Video.module.scss';

const Video = ({ slug }) => {
	return (
		<div className={classes['container']}>
			<video className={classes['video']} controls autoPlay>
				<source
					src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/clips/${slug}/watch`}
					type={'video/mp4'}
				/>
			</video>
		</div>
	);
};

export default Video;
