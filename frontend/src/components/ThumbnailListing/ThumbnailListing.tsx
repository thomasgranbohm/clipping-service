import Thumbnail from 'components/Thumbnail/Thumbnail';
import { useState } from 'react';
import { publicAPI } from 'utils/api';
import { concat, getURLFromModel } from 'utils/functions';
import useObserver from 'utils/hooks';
import classes from './ThumbnailListing.module.scss';

type ThumbnailListingProps = {
	items: [];
	next: string;
	total: number;
	type: 'show' | 'season' | 'episode' | 'clip';
};

const ThumbnailListing = ({
	items,
	next,
	total,
	type,
}: ThumbnailListingProps) => {
	const [stateItems, setStateItems] = useState(items);
	const [nextURL, setNextURL] = useState(next);
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
		<>
			<div className={concat(classes['container'], classes[type])}>
				{stateItems.map((props: any, i) => {
					const thumbnailProps = {
						title: 'index' in props && `Season ${props.index}`,
						url: getURLFromModel(props),
						...props,
					};

					return <Thumbnail key={i} type={type} {...thumbnailProps} />;
				})}
			</div>
			{sentinel}
		</>
	);
};

export default ThumbnailListing;
