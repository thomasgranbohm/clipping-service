import NextImage from 'next/image';
import { concat } from 'utils/functions';
import classes from './Image.module.scss';

export type ImageProps = {
	className?: string;
	src: string;
	alt: string;
	width: number;
	height: number;
};

const Image = ({ className = '', src, alt, width, height }: ImageProps) => (
	<div className={concat(classes['container'], className)}>
		<NextImage
			className={classes['image']}
			src={src.replace(
				process.env.NEXT_PUBLIC_BACKEND_URL,
				'http://backend:1337'
			)}
			alt={alt}
			width={width}
			height={height}
			layout="responsive"
			placeholder="blur"
			blurDataURL={`/_next/image?url=${encodeURIComponent(
				src.replace(process.env.NEXT_PUBLIC_BACKEND_URL, 'http://backend:1337')
			)}&w=8&q=1`}
			loading="lazy"
		/>
	</div>
);

export default Image;
