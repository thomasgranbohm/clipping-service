import Anchor from 'components/Anchor/Anchor';
import Image from 'components/Image/Image';
import classes from './ClipBlurb.module.scss';

export type ClipBlurbProps = {
	id: number;
	name: string;
	slug: string;
	start: number;
	end: number;
	ready: boolean;
	metadataKey: number;
	showKey: number;
	showTitle: string;
	seasonKey: number;
	seasonTitle: string;
	libraryKey: number;
	libraryTitle: string;
	createdAt: Date;
	updatedAt: Date;
};

const ClipBlurb = ({ name, slug }: ClipBlurbProps) => (
	<Anchor href={`/clips/${slug}`}>
		<div className={classes['container']}>
			{/* TODO: Needs fixing */}
			<Image
				className={classes['thumbnail']}
				src={`/clips/${slug}/thumbnail`}
				alt={name}
				width={1024}
				height={576}
			/>
			<p className={classes['title']}>{name}</p>
		</div>
	</Anchor>
);

export default ClipBlurb;
