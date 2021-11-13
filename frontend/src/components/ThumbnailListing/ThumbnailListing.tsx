import axios from 'axios';
import {
	EpisodeThumbnail,
	SeasonThumbnail,
	ShowThumbnail,
} from 'components/Thumbnail/Thumbnail';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import { publicAPI } from 'utils/api';
import {
	concat,
	flattenLinks,
	generateBackendURL,
	getURLFromModel,
} from 'utils/functions';
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

			const { data } = await publicAPI.get(
				`${url.origin}${url.pathname}/items${url.search}`.replace(
					process.env.NEXT_PUBLIC_BACKEND_URL,
					''
				)
			);
			setStateItems([...stateItems, ...(data['items'] as [])]);
		},
		{
			stoppingCondition: stateItems.length === total,
			rootMargin: '256px',
		}
	);

	return (
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
				if (type === 'episode') return <EpisodeThumbnail {...thumbnailProps} />;
			})}
			{sentinel}
		</div>
	);
};

export default ThumbnailListing;
