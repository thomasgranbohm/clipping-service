import Video from 'components/Video/Video';
import { useRouter } from 'next/dist/client/router';
import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { publicAPI } from 'utils/api';
import { concat, generateBackendURL } from 'utils/functions';
import classes from './ClipCreator.module.scss';

const MAX_CLIP_LENGTH = 60;
const MINIMUM_CLIP_LENGTH = 1;

const ClipCreator = ({ episode }) => {
	const { slug, duration } = episode;
	const { season } = episode;
	const { show } = season;
	const { library } = show;

	const videoRef = useRef<HTMLVideoElement>(null);

	const [time, setTime] = useState(0);
	const [start, setStart] = useState(0);
	const [end, setEnd] = useState(MAX_CLIP_LENGTH * 1e3);

	const [title, setTitle] = useState('');

	const router = useRouter();
	const url = generateBackendURL(router.asPath);

	const createClip: MouseEventHandler<HTMLButtonElement> = async (e) => {
		e.preventDefault();
		try {
			await publicAPI.get('/verify', {
				withCredentials: true,
			});
		} catch (error) {
			return router.push({
				href: '/login',
				query: `redirect=${router.asPath}`,
			});
		}

		try {
			await publicAPI('/clip', {
				method: 'POST',
				data: {
					episode: slug,
					season: season.index,
					show: show.slug,
					library: library.slug,
					title,
					start: (time + start) / 1000,
					end: (time + end) / 1000,
				},
			});
			alert('Clip created!');
		} catch (err) {
			console.log(err);
			alert('Error! Check the console.');
		}
	};

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.pause();
			videoRef.current.currentTime = (time + end) / 1000;
		}
	}, [time, end]);

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.pause();
			videoRef.current.currentTime = (time + start) / 1000;
		}
	}, [start, time]);

	useEffect(() => {
		let element = videoRef.current;
		if (element) {
			element.ontimeupdate = (e) => {
				if (e.target['currentTime'] > (time + end) / 1000) {
					element.currentTime = (time + start) / 1000;
					element.pause();
					element.ontimeupdate = null;
				}
			};
		}
		return () => {
			if (element) element.ontimeupdate = null;
		};
	}, [end, start, time]);

	return (
		<div className={classes['container']}>
			<Video ref={videoRef} url={url} />
			<div className={classes['crop-boundary']}>
				<h3>
					{new Date(time + start).toISOString().substr(14, 8)} -{' '}
					{new Date(time + end).toISOString().substr(14, 8)}
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
						max={duration - MAX_CLIP_LENGTH * 1e3}
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
							if (end - MINIMUM_CLIP_LENGTH * 1e3 <= newValue) return;
							setStart(newValue);
						}}
					/>
					<input
						type="range"
						name="end"
						id="end"
						value={end}
						className={classes['range']}
						onMouseUp={() =>
							(videoRef.current.currentTime = (time + start) / 1000)
						}
						min={0}
						max={MAX_CLIP_LENGTH * 1e3}
						onChange={(e) => {
							const newValue = parseInt(e.target.value);
							if (start + MINIMUM_CLIP_LENGTH * 1e3 >= newValue) return;
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
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			<button type="submit" onClick={createClip}>
				Create clip
			</button>
		</div>
	);
};

export default ClipCreator;
