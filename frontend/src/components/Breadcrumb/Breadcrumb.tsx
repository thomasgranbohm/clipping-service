import Anchor from 'components/Anchor/Anchor';
import classes from './Breadcrumb.module.scss';

type BreadcrumbProps = {
	libraryKey?: string;
	libraryTitle?: string;
	showKey?: string;
	showTitle?: string;
	seasonKey?: string;
	seasonTitle?: string;
	episodeKey?: string;
	episodeTitle?: string;
};

const Breadcrumb = ({
	episodeKey,
	episodeTitle,
	libraryKey,
	libraryTitle,
	seasonKey,
	seasonTitle,
	showKey,
	showTitle,
}: BreadcrumbProps) => (
	<nav className={classes['container']}>
		<Anchor href="/">Clipping Service</Anchor>
		{libraryKey && libraryTitle && (
			<>
				<span className={classes['slash']}>/</span>
				<Anchor href={`/library/${libraryKey}`}>{libraryTitle}</Anchor>
				{showKey && showTitle && (
					<>
						<span className={classes['slash']}>/</span>
						<Anchor href={`/show/${showKey}`}>{showTitle}</Anchor>
						{seasonKey && seasonTitle && (
							<>
								<span className={classes['slash']}>/</span>
								<Anchor href={`/season/${seasonKey}`}>{seasonTitle}</Anchor>
								{episodeKey && episodeTitle && (
									<>
										<span className={classes['slash']}>/</span>
										<Anchor href={`/episode/${episodeKey}`}>
											{episodeTitle}
										</Anchor>
									</>
								)}
							</>
						)}
					</>
				)}
			</>
		)}
	</nav>
);

export default Breadcrumb;
