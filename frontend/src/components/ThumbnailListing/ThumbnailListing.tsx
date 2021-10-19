import {
	EpisodeThumbnail,
	SeasonThumbnail,
	ShowThumbnail,
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
			{items.map((props, i) => {
				if (type === 'show') return <ShowThumbnail {...props} key={i} />;
				if (type === 'season') return <SeasonThumbnail {...props} key={i} />;
				if (type === 'episode') return <EpisodeThumbnail {...props} key={i} />;
			})}
		</div>
	</div>
);

export default ThumbnailListing;
