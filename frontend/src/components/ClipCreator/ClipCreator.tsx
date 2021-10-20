import Video from 'components/Video/Video';
import { useEffect, useRef, useState } from 'react';
import { publicAPI } from 'utils/api';
import classes from './ClipCreator.module.scss';

const MAX_CLIP_LENGTH = 60;

const ClipCreator = ({ details }) => {
	const { key, duration } = details;

	const videoRef = useRef<HTMLVideoElement>(null);

	const [start, setStart] = useState(0);
	const [end, setEnd] = useState(MAX_CLIP_LENGTH * 1e3);

	const [name, setName] = useState('');

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.currentTime = start / 1000;
			console.log(videoRef.current.currentTime);
		}
	}, [start, end]);

	return (
		<div className={classes['container']}>
			<Video ref={videoRef} identifier={key} type="media" />
			<div className={classes['crop-boundary']}>
				<input
					type="range"
					name="start"
					id="start"
					value={start}
					className={classes['start']}
					min={0}
					max={duration}
					onChange={(e) => {
						const newValue = parseInt(e.target.value);
						if (end <= newValue) return;
						setStart(newValue);
						if (end - newValue - MAX_CLIP_LENGTH * 1e3 > 0)
							setEnd(Math.min(newValue + MAX_CLIP_LENGTH * 1e3, duration));
					}}
				/>
				<input
					type="range"
					name="end"
					id="end"
					value={end}
					className={classes['end']}
					min={0}
					max={duration}
					onChange={(e) => {
						const newValue = parseInt(e.target.value);
						if (start >= newValue) return;
						setEnd(newValue);
						if (newValue - start - MAX_CLIP_LENGTH * 1e3 > 0)
							setStart(Math.max(newValue - MAX_CLIP_LENGTH * 1e3, 0));
					}}
				/>
			</div>
			<button
				onClick={() =>
					videoRef.current.paused
						? videoRef.current.play()
						: videoRef.current.pause()
				}
			>
				play / pause
			</button>
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<button
				type="submit"
				onClick={async (e) => {
					e.preventDefault();
					try {
						const resp = await publicAPI('/clips', {
							method: 'POST',
							data: {
								metadataKey: key,
								name,
								start: start / 1000,
								end: end / 1000,
							},
						});
						console.log(resp.data);
						alert('Clip created!');
					} catch (err) {
						console.log(err);
						alert('Error! Check the console.');
					}
				}}
			>
				Create clip
			</button>
		</div>
	);
};

export default ClipCreator;
