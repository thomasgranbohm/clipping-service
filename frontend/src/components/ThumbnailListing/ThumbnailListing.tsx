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
	<div className={concat(classes['container'], classes[type])}>
		{items.map((props, i) => {
			if (type === 'show') return <ShowThumbnail {...props} key={i} />;
			if (type === 'season') return <SeasonThumbnail {...props} key={i} />;
			if (type === 'episode') return <EpisodeThumbnail {...props} key={i} />;
		})}
	</div>
);

export default ThumbnailListing;
