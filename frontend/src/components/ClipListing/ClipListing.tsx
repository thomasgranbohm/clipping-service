import classes from './ClipListing.module.scss';
import ClipBlurb, { ClipBlurbProps } from '../ClipBlurb/ClipBlurb';

type ClipListingProps = {
	clips: [ClipBlurbProps];
};

const ClipListing = ({ clips }: ClipListingProps) => (
	<div className={classes['container']}>
		<h2>Clips</h2>
		<div className={classes['clips']}>
			<div className={classes['inner']}>
				{clips.map((clip) => (
					<ClipBlurb key={clip.id} {...clip} />
				))}
			</div>
		</div>
	</div>
);

export default ClipListing;
