import { ClipThumbnail } from 'components/Thumbnail/Thumbnail';
import { useState } from 'react';
import { publicAPI } from 'utils/api';
import { concat, generateBackendURL, getURLFromModel } from 'utils/functions';
import useObserver from 'utils/hooks';
import classes from './ClipListing.module.scss';

type ClipListingProps = {
	items: [];
	next: string;
	total?: number;
};

const ClipListing = ({ items, next, total }: ClipListingProps) => {
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
	const [nextURL, setNextURL] = useState(next);
	const [stateItems, setStateItems] = useState(items);
	const sentinel = useObserver(
		async () => {
			const { data } = await publicAPI.get(nextURL);
			setNextURL(data['next']);
			setStateItems([...stateItems, ...(data['items'] as [])]);
		},
		{
			stoppingCondition: stateItems.length === total,
			rootMargin: '256px',
		}
	);

	return (
		<div className={concat(classes['container'])}>
			<h2>Clips</h2>
			{stateItems instanceof Array && stateItems.length > 0 ? (
				<div className={classes['clips']}>
					{stateItems.map((clip, i) => (
						<ClipThumbnail key={i} {...clip} url={getURLFromModel(clip)} />
					))}
					{sentinel}
				</div>
			) : (
				<p>Oof baboof, no clips...</p>
			)}
			{/* {total && sentinel} */}
		</div>
	);
};

export default ClipListing;
