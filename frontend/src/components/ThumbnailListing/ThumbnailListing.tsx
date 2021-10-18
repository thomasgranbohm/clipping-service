import { ShowThumbnail } from 'components/Thumbnail/Thumbnail';
import classes from './ThumbnailListing.module.scss';

export const ShowThumbnailListing = ({ items }) => (
	<div className={classes['container']}>
		{items.map((props, i) => (
			<ShowThumbnail {...props} key={i} />
		))}
	</div>
);
