import Anchor from 'components/Anchor/Anchor';
import classes from './LibraryListing.module.scss';

type LibraryListingProps = {
	libraries: { key: string; title: string }[];
};

const LibraryListing = ({ libraries }: LibraryListingProps) => (
	<ul className={classes['container']}>
		{libraries.map(({ key, title }) => (
			<li key={key}>
				<Anchor href={`/library/${key}`} className={classes['library']}>
					{title}
				</Anchor>
			</li>
		))}
	</ul>
);

export default LibraryListing;
