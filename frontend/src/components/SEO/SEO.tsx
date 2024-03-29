import getConfig from 'next/config';
import Head from 'next/head';

type SEOProps = {
	title: string;
	description?: string;
	oembed?: string;
	image?: string;
	video?: string;
};

const { publicRuntimeConfig } = getConfig();

const SEO = ({ title, description, image, oembed, video }: SEOProps) => (
	<Head>
		<title>{title}</title>
		<meta property="og:title" content={title} />
		<meta property="og:site_name" content={publicRuntimeConfig.PAGE_TITLE} />
		{description && <meta name="description" content={description} />}
		{description && <meta property="og:description" content={description} />}
		{image && <meta property="og:image" content={image} />}
		{video && <meta property="og:video" content={video} />}
		{oembed && (
			<link rel="alternate" type="application/json+oembed" href={oembed} />
		)}
	</Head>
);

export default SEO;
