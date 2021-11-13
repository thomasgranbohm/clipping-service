import Anchor from 'components/Anchor/Anchor';
import Image from 'components/Image/Image';
import { useRouter } from 'next/dist/client/router';
import { addToURL, concat, generateBackendURL } from 'utils/functions';
import classes from './Thumbnail.module.scss';

export const ShowThumbnail = (props: ThumbnailProps) => (
	<Thumbnail {...props} thumbnailType="show" />
);

type SeasonThumbnailProps = {
	index: number;
} & Exclude<ThumbnailProps, 'slug'>;

export const SeasonThumbnail = ({ index, ...props }: SeasonThumbnailProps) => (
	<Thumbnail {...props} slug={index.toString()} thumbnailType="season" />
);

export const EpisodeThumbnail = (props: ThumbnailProps) => (
	<Thumbnail {...props} thumbnailType="episode" />
);

export const ClipThumbnail = (props: ThumbnailProps) => (
	<Thumbnail {...props} thumbnailType="clip" type="clips" />
);

export type ThumbnailProps = {
	type: string;
	slug: string;
	title: string;
	thumbnailType: 'show' | 'season' | 'episode' | 'clip';
};

const Thumbnail = ({ type, slug, thumbnailType, title }: ThumbnailProps) => {
	const router = useRouter();
	const backendURL = generateBackendURL(
		`${router.asPath}/${slug}`,
		thumbnailType === 'clip'
	);

	return (
		<Anchor
			href={`${thumbnailType === 'clip' ? '/clips' : router.asPath}/${slug}`}
		>
			<div className={concat(classes['container'], classes[thumbnailType])}>
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
