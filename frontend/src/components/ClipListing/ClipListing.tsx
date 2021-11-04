import { ClipThumbnail } from 'components/Thumbnail/Thumbnail';
import { useState } from 'react';
import { publicAPI } from 'utils/api';
import { concat } from 'utils/functions';
import useObserver from 'utils/hooks';
import classes from './ClipListing.module.scss';

type ClipListingProps = {
	items: [];
	total?: number;
};

const ClipListing = ({ items, total }: ClipListingProps) => {
	// const [stateClips, setStateClips] = useState<Array<any>>(items);

	// const sentinel = useObserver(
	// 	async () => {
	// 		const { data } = await publicAPI(`/clips?offset=${stateClips.length}`);
	// 		const newClips = data['clips'];

	// 		setStateClips([...stateClips, ...newClips]);
	// 	},
	// 	{
	// 		condition: stateClips.length === total,
	// 	}
	// );

	return (
		<div className={concat(classes['container'])}>
			<h2>Clips</h2>
			<div className={classes['clips']}>
				{items.map((clip) => (
					<ClipThumbnail {...clip} />
				))}
			</div>
			{/* {total && sentinel} */}
		</div>
	);
};

export default ClipListing;
