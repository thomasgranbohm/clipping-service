import '../styles/globals.scss';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Component {...pageProps} />
			{/* {process.env.NODE_ENV !== 'production' && (
				<pre>
					<code>{JSON.stringify(pageProps, null, 4)}</code>
				</pre>
			)} */}
		</>
	);
}
export default MyApp;
