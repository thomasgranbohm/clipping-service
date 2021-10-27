import Anchor from 'components/Anchor/Anchor';
import classes from './Breadcrumb.module.scss';

const Breadcrumb = ({ href, title, slash }) => (
	<>
		<Anchor href={href}>{title}</Anchor>
		{slash && <span className={classes['slash']}>/</span>}
	</>
);

type BreadcrumbsProps = {
	links: { href: string; title: string }[];
};

const Breadcrumbs = ({ links }: BreadcrumbsProps) => (
	<nav className={classes['container']}>
		{links &&
			links.map(({ href, title }, i) => (
				<Breadcrumb
					key={i}
					href={href}
					slash={i !== links.length - 1}
					title={title}
				/>
			))}
	</nav>
);
export default Breadcrumbs;
