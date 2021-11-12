import axios from 'axios';
import {
	EpisodeThumbnail,
	SeasonThumbnail,
	ShowThumbnail,
} from 'components/Thumbnail/Thumbnail';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import { publicAPI } from 'utils/api';
import { concat, generateBackendURL } from 'utils/functions';
import useObserver from 'utils/hooks';
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
	const [stateItems, setStateItems] = useState(items);
	const router = useRouter();
	const sentinel = useObserver(
		async () => {
			const url = generateBackendURL(router.asPath);
			url.searchParams.append('offset', stateItems.length.toString());

			const { data } = await axios.get(`${url.pathname}/items${url.search}`);
			setStateItems([...stateItems, ...(data['items'] as [])]);
		},
		{
			stoppingCondition: stateItems.length === total,
			rootMargin: '256px',
		}
	);

	return (
		<div className={concat(classes['container'], classes[type])}>
			{stateItems.map((props, i) => {
				if (type === 'show')
					return <ShowThumbnail type={type} {...props} key={i} />;
				if (type === 'season')
					return <SeasonThumbnail type={type} {...props} key={i} />;
				if (type === 'episode')
					return <EpisodeThumbnail type={type} {...props} key={i} />;
			})}
			{sentinel}
		</div>
	);
};

export default ThumbnailListing;
