import Anchor from 'components/Anchor/Anchor';
import Image from 'components/Image/Image';
import { useRouter } from 'next/dist/client/router';
import { concat } from 'utils/functions';
import classes from './Thumbnail.module.scss';

export const ShowThumbnail = ({ thumb, ...props }: ThumbnailProps) => (
	<Thumbnail {...props} thumb={`/items/${thumb}`} thumbnailType="show" />
);

type SeasonThumbnailProps = {
	index: number;
} & Exclude<ThumbnailProps, 'slug'>;

export const SeasonThumbnail = ({
	thumb,
	index,
	...props
}: SeasonThumbnailProps) => (
	<Thumbnail
		{...props}
		slug={`${index.toString()}`}
		thumb={`/items/${thumb}`}
		thumbnailType="season"
	/>
);

export const EpisodeThumbnail = ({ thumb, ...props }: ThumbnailProps) => (
	<Thumbnail {...props} thumb={`/items/${thumb}`} thumbnailType="episode" />
);

export const ClipThumbnail = ({ slug, ...props }: ThumbnailProps) => (
	<Thumbnail
		{...props}
		slug={slug}
		thumbnailType="clip"
		type="clips"
		thumb={`/clips/${slug}/thumbnail`}
	/>
);

export type ThumbnailProps = {
	type: string;
	slug: string;
	thumb: string;
	title: string;
	thumbnailType: 'show' | 'season' | 'episode' | 'clip';
};

const Thumbnail = ({ type, slug, thumb, title }: ThumbnailProps) => {
	const router = useRouter();

	return (
		<Anchor href={`${router.asPath}/${slug}`}>
			<div className={concat(classes['container'], classes[type])}>
				<div className={classes['thumbnail-container']}>
					<Image
						alt={title}
						className={classes['thumbnail']}
						height={576}
						width={type === 'show' || type === 'season' ? 384 : 1024}
						src={thumb}
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
