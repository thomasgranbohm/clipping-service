import ThumbnailListing from 'components/ThumbnailListing/ThumbnailListing';

type ClipListingProps = {
	items: [];
	next: string;
	total: number;
};

const ClipListing = (props: ClipListingProps) => (
	<div>
		<h2>Clips</h2>
		{props.items instanceof Array && props.items.length > 0 ? (
			<ThumbnailListing type="clip" {...props} />
		) : (
			<p>Oof baboof, no clips...</p>
		)}
	</div>
);

export default ClipListing;
