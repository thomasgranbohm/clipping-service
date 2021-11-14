type SEOProps = {
	title: string;
	description?: string;
	oembed?: string;
	image?: string;
	video?: string;
};

const SEO = ({ title, description, image, oembed, video }: SEOProps) => (
	<>
		<title>{title}</title>
		<meta property="og:title" content={title} />
		<meta
			property="og:site_name"
			content={process.env.NEXT_PUBLIC_PAGE_TITLE}
		/>
		{description && <meta name="description" content={description} />}
		{description && <meta property="og:description" content={description} />}
		{image && <meta property="og:image" content={image} />}
		{video && <meta property="og:video" content={video} />}
		{oembed && (
			<link rel="alternate" type="application/json+oembed" href={oembed} />
		)}
	</>
);

export default SEO;
