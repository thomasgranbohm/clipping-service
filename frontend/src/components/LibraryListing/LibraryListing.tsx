import Anchor from 'components/Anchor/Anchor';
import classes from './LibraryListing.module.scss';

type LibraryListingProps = {
	items: { title: string; slug: string }[];
};

const LibraryListing = ({ items }: LibraryListingProps) => (
	<ul className={classes['container']}>
		{items.map(({ slug, title }) => (
			<li key={slug}>
				<Anchor href={`/${slug}`} className={classes['library']}>
					{title}
				</Anchor>
			</li>
		))}
	</ul>
);

export default LibraryListing;
