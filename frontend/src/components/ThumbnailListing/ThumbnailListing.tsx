import {
	EpisodeThumbnail,
	SeasonThumbnail,
	ShowThumbnail,
} from 'components/Thumbnail/Thumbnail';
import { concat } from 'utils/functions';
import classes from './ThumbnailListing.module.scss';

type ThumbnailListingProps = {
	items: [];
	offset: number;
	total: number;
	type: 'show' | 'season' | 'episode';
};

const ThumbnailListing = ({
	items,
	offset,
	total,
	type,
}: ThumbnailListingProps) => {
	return (
		<div className={concat(classes['container'], classes[type])}>
			{items.map((props, i) => {
				if (type === 'show')
					return <ShowThumbnail type={type} {...props} key={i} />;
				if (type === 'season')
					return <SeasonThumbnail type={type} {...props} key={i} />;
				if (type === 'episode')
					return <EpisodeThumbnail type={type} {...props} key={i} />;
			})}
		</div>
	);
};

export default ThumbnailListing;
