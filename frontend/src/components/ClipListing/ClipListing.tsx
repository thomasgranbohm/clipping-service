import { ClipThumbnail } from 'components/Thumbnail/Thumbnail';
import { useState } from 'react';
import { publicAPI } from 'utils/api';
import { concat } from 'utils/functions';
import useObserver from 'utils/hooks';
import classes from './ClipListing.module.scss';

type ClipListingProps = {
	clips: [];
	total?: number;
};

const ClipListing = ({ clips, total }: ClipListingProps) => {
	const [stateClips, setStateClips] = useState<Array<any>>(clips);

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
					<ClipThumbnail {...clip} />
				))}
			</div>
			{total && sentinel}
		</div>
	);
};

export default ClipListing;
