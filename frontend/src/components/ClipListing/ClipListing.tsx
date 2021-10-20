import classes from './ClipListing.module.scss';
import ClipBlurb, { ClipBlurbProps } from '../ClipBlurb/ClipBlurb';
import { concat } from 'utils/functions';

type ClipListingProps = {
	clips: [ClipBlurbProps];
};

const ClipListing = ({ clips }: ClipListingProps) => (
	<div className={concat(classes['container'])}>
		<h2>Clips</h2>
		<div className={classes['clips']}>
			{clips.map((clip) => (
				<ClipBlurb key={clip.id} {...clip} />
			))}
		</div>
	</div>
);

export default ClipListing;
