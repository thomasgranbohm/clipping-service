import {
	EpisodeThumbnail,
	SeasonThumbnail,
	ShowThumbnail,
} from 'components/Thumbnail/Thumbnail';
import { useState } from 'react';
import { publicAPI } from 'utils/api';
import { concat, getURLFromModel } from 'utils/functions';
import useObserver from 'utils/hooks';
import classes from './ThumbnailListing.module.scss';

type ThumbnailListingProps = {
	items: [];
	next: string;
	total: number;
	type: 'show' | 'season' | 'episode';
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
						key: i,
						title: 'index' in props && `Season ${props.index}`,
						type,
						url: getURLFromModel(props),
						...props,
					};
					if (type === 'show') return <ShowThumbnail {...thumbnailProps} />;
					if (type === 'season') return <SeasonThumbnail {...thumbnailProps} />;
					if (type === 'episode')
						return <EpisodeThumbnail {...thumbnailProps} />;
				})}
			</div>
			{sentinel}
		</>
	);
};

export default ThumbnailListing;
