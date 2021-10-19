import { Head, Html, Main, NextScript } from 'next/document';

const CustomDocument = () => (
	<Html lang="en">
		<Head>
			<link rel="manifest" href="/webmanifest.json" />
			<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
		</Head>
		<body>
			<Main />
			<NextScript />
		</body>
	</Html>
);

export default CustomDocument;
