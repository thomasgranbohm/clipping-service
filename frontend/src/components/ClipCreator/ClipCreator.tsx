import Video from 'components/Video/Video';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { publicAPI } from 'utils/api';
import { concat } from 'utils/functions';
import classes from './ClipCreator.module.scss';

const MAX_CLIP_LENGTH = 60;

const ClipCreator = ({ details }) => {
	const { key, duration } = details;

	const videoRef = useRef<HTMLVideoElement>(null);

	const [time, setTime] = useState(0);
	const [start, setStart] = useState(0);
	const [end, setEnd] = useState(MAX_CLIP_LENGTH * 1e3);

	const [name, setName] = useState('');

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.currentTime = (time + start) / 1000;

			videoRef.current.ontimeupdate = (e) => {
				if (e.target['currentTime'] >= (time + end) / 1000) {
					videoRef.current.currentTime = time;
					videoRef.current.pause();
					videoRef.current.ontimeupdate = null;
				}
			};
		}
	}, [end, start, time]);

	return (
		<div className={classes['container']}>
			<Video ref={videoRef} identifier={key} type="media" />
			<div className={classes['crop-boundary']}>
				<h3>
					{new Date(time + start).toISOString().substr(14, 9)} -{' '}
					{new Date(time + end).toISOString().substr(14, 9)}
				</h3>
				<div className={classes['slider-container']}>
					<h4>Start</h4>
					<input
						className={classes['range']}
						type="range"
						name="duration"
						id="duration"
						value={time}
						onChange={(e) => {
							const newValue = parseInt(e.target.value);
							setTime(newValue);
						}}
						max={duration}
					/>
				</div>
				<div className={classes['slider-container']}>
					<h4>Precision</h4>
					<input
						type="range"
						name="start"
						id="start"
						value={start}
						className={concat(classes['range'], classes['start'])}
						min={0}
						max={MAX_CLIP_LENGTH * 1e3}
						onChange={(e) => {
							const newValue = parseInt(e.target.value);
							if (end <= newValue) return;
							setStart(newValue);
						}}
					/>
					<input
						type="range"
						name="end"
						id="end"
						value={end}
						className={classes['range']}
						min={0}
						max={MAX_CLIP_LENGTH * 1e3}
						onChange={(e) => {
							const newValue = parseInt(e.target.value);
							if (start >= newValue) return;
							setEnd(newValue);
						}}
					/>
				</div>
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
								start: (time + start) / 1000,
								end: (time + end) / 1000,
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
