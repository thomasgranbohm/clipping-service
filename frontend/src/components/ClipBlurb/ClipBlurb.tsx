import Anchor from 'components/Anchor/Anchor';
import NextImage from 'next/image';
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
			{/* TODO: Needs fixing */}
			<NextImage
				className={classes['thumbnail']}
				src={`${process.env.NEXT_PUBLIC_BACKEND_URL.replace(
					'localhost:9001/api',
					'backend:1337'
				)}/clips/${slug}/thumbnail`}
				alt={name}
				width={256}
				height={144}
				placeholder="blur"
				blurDataURL={`_next/image?url=${process.env.NEXT_PUBLIC_BACKEND_URL.replace(
					'localhost:9001/api',
					'backend:1337'
				)}/clips/${slug}/thumbnail&w=256&q=1`}
			/>
			<b>{name}</b>
		</div>
	</Anchor>
);

export default ClipBlurb;
