import NextImage from 'next/image';
import { concat } from 'utils/functions';
import classes from './Image.module.scss';

const Image = ({ className = '', src, alt, width, height }) => (
	<NextImage
		className={concat(classes['container'], className)}
		src={`${process.env.NEXT_PUBLIC_BACKEND_URL.replace(
			/^https?:\/\/(.*?)$/g.exec(process.env.NEXT_PUBLIC_BACKEND_URL)[1],
			'backend:1337'
		)}${src}`}
		// src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${src}`}
		alt={alt}
		width={width}
		height={height}
		layout={'intrinsic'}
		placeholder="blur"
		blurDataURL={`/_next/image?url=${process.env.NEXT_PUBLIC_BACKEND_URL.replace(
			/^https?:\/\/(.*?)$/g.exec(process.env.NEXT_PUBLIC_BACKEND_URL)[1],
			'backend:1337'
		)}${src}&w=8&q=1`}
	/>
);

export default Image;
