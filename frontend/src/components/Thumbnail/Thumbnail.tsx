import Anchor from 'components/Anchor/Anchor';
import Image from 'components/Image/Image';
import { concat } from 'utils/functions';
import classes from './Thumbnail.module.scss';

type ShowThumbnailProps = {
	showKey: string;
	showThumb: string;
} & Exclude<ThumbnailProps, 'metadataKey thumb'>;

export const ShowThumbnail = ({
	showThumb,
	showKey,
	...props
}: ShowThumbnailProps) => (
	<Thumbnail
		{...props}
		metadataKey={showKey}
		thumb={showThumb}
		thumbnailType="show"
	/>
);

type SeasonThumbnailProps = {
	seasonKey: string;
	seasonThumb: string;
} & Exclude<ThumbnailProps, 'metadataKey thumb'>;

export const SeasonThumbnail = ({
	seasonThumb,
	seasonKey,
	...props
}: SeasonThumbnailProps) => (
	<Thumbnail
		{...props}
		metadataKey={seasonKey}
		thumb={seasonThumb}
		thumbnailType="season"
	/>
);

type EpisodeThumbnailProps = {
	episodeKey: string;
	episodeThumb: string;
	episodeArt: string;
} & Exclude<ThumbnailProps, 'metadataKey thumb'>;

export const EpisodeThumbnail = ({
	episodeThumb,
	episodeKey,
	episodeArt,
	...props
}: EpisodeThumbnailProps) => (
	<Thumbnail
		{...props}
		metadataKey={episodeKey}
		thumb={episodeThumb}
		thumbnailType="episode"
	/>
);

export type ThumbnailProps = {
	type: string;
	metadataKey: string;
	thumb: string;
	title: string;
	thumbnailType: 'show' | 'season' | 'episode';
};

const Thumbnail = ({ type, metadataKey, thumb, title }: ThumbnailProps) => (
	<Anchor href={`/${type}/${metadataKey}`}>
		<div className={concat(classes['container'], classes[type])}>
			<Image
				alt={title}
				className={classes['thumbnail']}
				height={576}
				width={type === 'show' || type === 'season' ? 384 : 1024}
				src={`/items/${thumb}`}
			/>
			<p className={classes['title']} title={title}>
				{title}
			</p>
		</div>
	</Anchor>
);

export default Thumbnail;