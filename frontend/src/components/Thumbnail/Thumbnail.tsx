import Anchor from 'components/Anchor/Anchor';
import Image from 'components/Image/Image';
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
	<Thumbnail {...props} metadataKey={showKey} thumb={showThumb} />
);

type ThumbnailProps = {
	type: string;
	metadataKey: string;
	thumb: string;
	title: string;
};

const Thumbnail = ({ type, metadataKey, thumb, title }: ThumbnailProps) => (
	<Anchor href={`/${type}/${metadataKey}`}>
		<div className={classes['container']}>
			<Image
				alt={title}
				className={classes['thumbnail']}
				height={512}
				width={348}
				src={`/items/${metadataKey}/thumb/${thumb}`}
			/>
			<p className={classes['title']} title={title}>
				{title}
			</p>
		</div>
	</Anchor>
);

export default Thumbnail;
