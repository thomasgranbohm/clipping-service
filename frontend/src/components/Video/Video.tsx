import ControlInterface from 'components/ControlInterface/ControlInterface';
import ProgressBar from 'components/ProgressBar/ProgressBar';
import { useEffect, useRef, useState } from 'react';
import { concat } from 'utils/functions';
import classes from './Video.module.scss';

const Video = ({ duration, slug, ready }) => {
	if (!ready)
		return (
			<div className={classes['container']}>
				<h1>Clip not ready yet</h1>
			</div>
		);

	const [hovering, setHovering] = useState(false);
	const [ended, setEnded] = useState(false);
	const [fullscreen, setFullscreen] = useState(false);
	const [shouldPlay, setShouldPlay] = useState(false);
	const [time, setTime] = useState(0);

	const containerRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const progressRef = useRef<HTMLProgressElement>(null);

	// onMount
	useEffect(() => {
		let hoverTimeout = null;
		let progressInterval = null;
		if (containerRef.current) {
			containerRef.current.onmouseover = () => {
				if (!hovering) setHovering(true);
				if (hoverTimeout) clearTimeout(hoverTimeout);
			};
			containerRef.current.onmouseleave = () => {
				hoverTimeout = setTimeout(() => setHovering(false), 1e3);
			};
			containerRef.current.onmousemove = () => {
				if (hoverTimeout) clearTimeout(hoverTimeout);
				if (hovering) hoverTimeout = setTimeout(() => setHovering(false), 1e3);
			};
		}
		if (videoRef.current) {
			videoRef.current.onplaying = () => {
				if (!progressInterval) {
					progressInterval = setInterval(
						() => setTime(videoRef.current.currentTime),
						16
					);
				}
			};
			videoRef.current.oncanplay = () => {
				if (!progressInterval) {
					progressInterval = setInterval(
						() => setTime(videoRef.current.currentTime),
						16
					);
				}
			};
		}
		return () => {
			if (hoverTimeout) clearTimeout(hoverTimeout);
			if (progressInterval) clearInterval(progressInterval);
			if (videoRef.current) videoRef.current.oncanplay = null;
			if (containerRef.current) {
				containerRef.current.onmousemove = null;
				containerRef.current.onmouseleave = null;
				containerRef.current.onmousemove = null;
			}
			if (setTime) setTime(0);
			if (hovering && setHovering) setHovering(false);
		};
	}, []);

	// onPlayingStateChange
	useEffect(() => {
		if (videoRef.current) {
			if (shouldPlay) videoRef.current.play();
			else if (!shouldPlay) videoRef.current.pause();
		}
	}, [shouldPlay]);

	const playOrPause = () => setShouldPlay(!shouldPlay);

	const toggleFullscreen = () => {
		if (!fullscreen) containerRef.current.requestFullscreen();
		else if (document) document.exitFullscreen().catch(() => {});
		setFullscreen(!fullscreen);
	};

	const setTimeFromProgress = (e) => {
		if (videoRef.current) {
			videoRef.current.currentTime =
				(videoRef.current.duration * e.nativeEvent.offsetX) /
				progressRef.current.clientWidth;
		}
	};

	return (
		<div
			className={concat(classes['container'], [classes['hovering'], hovering])}
			ref={containerRef}
		>
			<div className={classes['controls']}>
				<ProgressBar
					className={classes['progress']}
					ref={progressRef}
					currentTime={time}
					duration={duration}
					setTimeFromProgress={setTimeFromProgress}
				/>
				<ControlInterface
					className={classes['controls']}
					videoState={shouldPlay}
					toggleVideoState={playOrPause}
					fullscreen={fullscreen}
					toggleFullscreen={toggleFullscreen}
				/>
			</div>
			<video
				className={classes['video']}
				onClick={playOrPause}
				playsInline
				poster={`${process.env.NEXT_PUBLIC_BACKEND_URL}/clips/${slug}/thumbnail`}
				ref={videoRef}
				onDoubleClick={toggleFullscreen}
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
