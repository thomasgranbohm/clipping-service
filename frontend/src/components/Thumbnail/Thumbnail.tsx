import Anchor from 'components/Anchor/Anchor';
import Image from 'components/Image/Image';
import { forwardRef } from 'react';
import { addToURL, concat, generateBackendURL } from 'utils/functions';
import classes from './Thumbnail.module.scss';

export type SkeletonThumbnailProps = Pick<ThumbnailProps, 'type'>;

export type ThumbnailProps = {
	url: string;
	title: string;
	type: 'show' | 'season' | 'episode' | 'clip';
	disabled?: boolean;
};

export const SkeletonThumbnail = forwardRef<
	HTMLDivElement,
	SkeletonThumbnailProps
>(({ type }, ref) => {
	return (
		<div
			ref={ref}
			className={concat(classes['content'], classes[type], classes['skeleton'])}
		>
			<div className={classes['thumbnail-container']}>
				<div className={classes['thumbnail']} />
			</div>
			<p className={classes['title']} aria-hidden>
				filler
			</p>
		</div>
	);
});

SkeletonThumbnail.displayName = 'SkeletonThumbnail';

const Thumbnail = ({ url, type, title, disabled }: ThumbnailProps) => {
	const backendURL = generateBackendURL(url);

	return (
		<Anchor
			className={classes['container']}
			href={url}
			aria-disabled={disabled}
		>
			<div className={concat(classes['content'], classes[type])}>
				<div className={classes['thumbnail-container']}>
					<Image
						alt={title}
						className={classes['thumbnail']}
						height={576}
						width={type === 'show' || type === 'season' ? 384 : 1024}
						src={addToURL(backendURL, 'thumbnail').href}
					/>
				</div>
				<p className={classes['title']} title={title}>
					{title}
				</p>
			</div>
		</Anchor>
	);
};

export default Thumbnail;
