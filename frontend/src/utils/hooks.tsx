import { useEffect, useState } from 'react';
import { publicAPI } from './api';

export const useLoggedIn = () => {
	const [loggedIn, setLoggedIn] = useState<boolean>(false);

	useEffect(() => {
		publicAPI('/verify', {
			withCredentials: true,
		})
			.then(() => setLoggedIn(true))
			.catch((err) => console.log('Not logged in', err));
	}, []);

	return { loggedIn };
};
