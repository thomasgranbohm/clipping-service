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
	<h2 className={classes['container']}>
		{libraryKey && libraryTitle && (
			<>
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
	</h2>
);

export default Breadcrumb;
