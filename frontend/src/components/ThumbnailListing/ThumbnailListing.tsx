import {
	EpisodeThumbnail,
	SeasonThumbnail,
	ShowThumbnail,
	ThumbnailProps,
} from 'components/Thumbnail/Thumbnail';
import { concat } from 'utils/functions';
import classes from './ThumbnailListing.module.scss';

type ThumbnailListingProps = {
	type: 'show' | 'season' | 'episode';
	items: [];
};

const ThumbnailListing = ({ type, items }: ThumbnailListingProps) => (
	<div className={classes['container']}>
		{type !== 'show' && <h2 className={classes['title']}>{type + 's'}</h2>}
		<div className={concat(classes['items'], classes[type])}>
			{items.map((props, i) => (
				<>
					{type === 'show' && <ShowThumbnail {...props} key={i} />}
					{type === 'season' && <SeasonThumbnail {...props} key={i} />}
					{type === 'episode' && <EpisodeThumbnail {...props} key={i} />}{' '}
				</>
			))}
		</div>
	</div>
);

export default ThumbnailListing;
