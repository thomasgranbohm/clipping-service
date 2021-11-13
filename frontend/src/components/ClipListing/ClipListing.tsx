import { ClipThumbnail } from 'components/Thumbnail/Thumbnail';
import { concat } from 'utils/functions';
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
			{items instanceof Array && items.length > 0 ? (
				<div className={classes['clips']}>
					{items.map((clip, i) => (
						<ClipThumbnail key={i} {...clip} />
					))}
				</div>
			) : (
				<p>Oof baboof, no clips...</p>
			)}
			{/* {total && sentinel} */}
		</div>
	);
};

export default ClipListing;
