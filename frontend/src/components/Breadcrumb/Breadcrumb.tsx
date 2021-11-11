import Anchor from 'components/Anchor/Anchor';
import { flattenLinks } from 'utils/functions';
import { BreadcrumbData, JointBreadcrumbType } from 'utils/types';
import classes from './Breadcrumb.module.scss';

const Breadcrumb = ({ href, title, slash }) => (
	<>
		<Anchor href={`${href}`}>{title}</Anchor>
		{slash && <span className={classes['slash']}>/</span>}
	</>
);

type Library = {
	slug: string;
	title: string;
};
type Show = {
	slug: string;
	title: string;
	library: Library;
};
type Season = {
	index: number;
	show: Show;
};
type Episode = {
	title: string;
	slug: string;
	season: Season;
};

type BreadcrumbsProps = {
	links: BreadcrumbData[];
};

const Breadcrumbs = ({ links }: BreadcrumbsProps) => (
	<nav className={classes['container']}>
		{links &&
			links.map((props, i, arr) => (
				<Breadcrumb key={i} {...props} slash={i !== arr.length - 1} />
			))}
	</nav>
);
export default Breadcrumbs;
