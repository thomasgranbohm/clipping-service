import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import { publicAPI } from 'utils/api';

const LoginPage = () => {
	const [password, setPassword] = useState<string>('');

	const router = useRouter();

	const login = async (e) => {
		e.preventDefault();

		try {
			await publicAPI.post(
				'/login',
				{
					password,
				},
				{ withCredentials: true }
			);

			if ('redirect' in router.query) {
				const redirect = router.query.redirect.toString();
				if (redirect.startsWith('/')) {
					return router.push(redirect);
				}
			}
			return router.push('/');
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="container">
			<h1>Login</h1>
			<form>
				<input
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Ver1S3cureP4ssw0rd1997"
					type="password"
					name="password"
				/>
				<button onClick={login} type="submit">
					Login
				</button>
			</form>
		</div>
	);
};

export default LoginPage;
