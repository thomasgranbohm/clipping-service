import Anchor from 'components/Anchor/Anchor';
import Image from 'components/Image/Image';
import { useRouter } from 'next/dist/client/router';
import {
	addToURL,
	concat,
	flattenLinks,
	generateBackendURL,
} from 'utils/functions';
import classes from './Thumbnail.module.scss';

export const ShowThumbnail = (props: ThumbnailProps) => (
	<Thumbnail {...props} thumbnailType="show" />
);

export const SeasonThumbnail = (props: ThumbnailProps) => (
	<Thumbnail {...props} thumbnailType="season" />
);

export const EpisodeThumbnail = (props: ThumbnailProps) => (
	<Thumbnail {...props} thumbnailType="episode" />
);

export const ClipThumbnail = (props: ThumbnailProps) => (
	<Thumbnail {...props} thumbnailType="clip" />
);

export type ThumbnailProps = {
	url: string;
	title: string;
	thumbnailType: 'show' | 'season' | 'episode' | 'clip';
};

const Thumbnail = ({ url, thumbnailType, title, ...props }: ThumbnailProps) => {
	const router = useRouter();
	const backendURL = generateBackendURL(url);

	return (
		<Anchor className={classes['container']} href={url}>
			<div className={concat(classes['content'], classes[thumbnailType])}>
				<div className={classes['thumbnail-container']}>
					<Image
						alt={title}
						className={classes['thumbnail']}
						height={576}
						width={
							thumbnailType === 'show' || thumbnailType === 'season'
								? 384
								: 1024
						}
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
