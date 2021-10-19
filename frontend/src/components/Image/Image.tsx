import NextImage from 'next/image';
import { concat } from 'utils/functions';
import classes from './Image.module.scss';

const Image = ({ className = '', src, alt, width, height }) => (
	<NextImage
		className={concat(classes['container'], className)}
		src={`${process.env.NEXT_PUBLIC_BACKEND_URL.replace(
			process.env.NEXT_PUBLIC_BACKEND_URL,
			'http://backend:1337'
		)}${src}`}
		alt={alt}
		width={width}
		height={height}
		layout={'intrinsic'}
		placeholder="blur"
		// blurDataURL={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0ntn5HwAEsgJWXUD+UAAAAABJRU5ErkJggg==`}
		blurDataURL={`/_next/image?url=${process.env.NEXT_PUBLIC_BACKEND_URL.replace(
			process.env.NEXT_PUBLIC_BACKEND_URL,
			'http://backend:1337'
		)}${src}&w=8&q=1`}
		loading="lazy"
	/>
);

export default Image;
