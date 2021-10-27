import classes from './ClipListing.module.scss';
import ClipBlurb, { ClipBlurbProps } from '../ClipBlurb/ClipBlurb';
import { concat } from 'utils/functions';
import { useState } from 'react';
import useObserver from 'utils/hooks';
import { publicAPI } from 'utils/api';

type ClipListingProps = {
	clips: [ClipBlurbProps];
	total?: number;
};

const ClipListing = ({ clips, total }: ClipListingProps) => {
	const [stateClips, setStateClips] = useState<ClipBlurbProps[]>(clips);

	const sentinel = useObserver(
		async () => {
			const { data } = await publicAPI(`/clips?offset=${stateClips.length}`);
			const newClips = data['clips'];

			setStateClips([...stateClips, ...newClips]);
		},
		{
			condition: stateClips.length === total,
		}
	);

	return (
		<div className={concat(classes['container'])}>
			<h2>Clips</h2>
			<div className={classes['clips']}>
				{stateClips.map((clip) => (
					<ClipBlurb key={clip.id} {...clip} />
				))}
			</div>
			{total && sentinel}
		</div>
	);
};

export default ClipListing;
