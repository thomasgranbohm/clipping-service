import Anchor from 'components/Anchor/Anchor';
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
	<Anchor href={`/clip/${slug}`}>
		<div className={classes['container']}>
			<img
				className={classes['thumbnail']}
				src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/clips/${slug}/thumbnail`}
				alt={name}
			/>
			<b>{name}</b>
		</div>
	</Anchor>
);

export default ClipBlurb;
