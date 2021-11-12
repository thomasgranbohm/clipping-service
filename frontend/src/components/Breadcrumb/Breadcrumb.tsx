import Anchor from 'components/Anchor/Anchor';
import { BreadcrumbData } from 'utils/types';
import classes from './Breadcrumb.module.scss';

const Breadcrumb = ({ href, title, slash }) => (
	<>
		<Anchor href={`${href}`}>{title}</Anchor>
		{slash && <span className={classes['slash']}>/</span>}
	</>
);

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
