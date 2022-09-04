import classes from './Summary.module.scss';
import Image, { ImageProps } from 'components/Image/Image';
import { ReactNode } from 'react';
import { concat } from 'utils/functions';

type SummaryProps = {
	children: ReactNode;
	image?: ImageProps;
};

const Summary = ({ children, image }: SummaryProps) => (
	<div className={concat(classes['container'], !image && classes['no-image'])}>
		<p className={classes['text']}>{children}</p>
		{image && (
			<Image
				className={classes['image']}
				alt="Thumbnail of the episode"
				{...image}
			/>
		)}
	</div>
);

export default Summary;
