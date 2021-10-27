import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import 'styles/globals.scss';
import colors from 'styles/_colors.module.scss';

function MyApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
			navigator.serviceWorker
				.register('/service-worker.js')
				.then(() => console.log('Registration succeeded.'))
				.catch((error) => console.log('Registration failed with ' + error));
		}
	}, []);

	return (
		<>
			<Head>
				<meta name="theme-color" content={colors['accent']} />
			</Head>
			<Component {...pageProps} />
			{process.env.NODE_ENV !== 'production' && (
				<pre>
					<code>{JSON.stringify(pageProps, null, 4)}</code>
				</pre>
			)}
		</>
	);
}
export default MyApp;
