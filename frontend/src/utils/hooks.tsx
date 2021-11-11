import { useEffect, useRef, useState } from 'react';
import { publicAPI } from './api';

export const useLoggedIn = () => {
	const [loggedIn, setLoggedIn] = useState<boolean>(false);

	useEffect(() => {
		publicAPI('/verify', {
			withCredentials: true,
		})
			.then(() => setLoggedIn(true))
			.catch((err) => {});
	}, []);

	return { loggedIn };
};

const useObserver = (
	callback: () => {},
	options?: {
		stoppingCondition?: boolean;
	} & IntersectionObserverInit
) => {
	const ref = useRef(null);
	const [loading, setLoading] = useState(false);

	const { stoppingCondition: stoppingCondition, ...rest } = options;

	useEffect(() => {
		const observer = new IntersectionObserver(
			async ([entry]) => {
				if (!entry.isIntersecting || stoppingCondition || loading) return;

				setLoading(true);
				await callback();
				setLoading(false);
			},
			{
				root: null,
				rootMargin: '256px',
				threshold: 0.0,
				...rest,
			}
		);

		const { current } = ref;

		if (current) observer.observe(current);

		return () => {
			if (current) observer.disconnect();
		};
	});

	const sentinel = !stoppingCondition && <div ref={ref}></div>;

	return sentinel;
};

export default useObserver;
