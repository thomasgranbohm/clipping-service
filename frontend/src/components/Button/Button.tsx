import axios from 'axios';
import Anchor from 'components/Anchor/Anchor';
import Icon from 'components/Icon/Icon';
import { useRouter } from 'next/dist/client/router';
import { FC } from 'react';
import { internalAPI, publicAPI } from 'utils/api';
import { concat } from 'utils/functions';
import classes from './Button.module.scss';

type ButtonProps = {
	href: string;
	type: 'download' | 'delete' | 'create';
};

const Button: FC<ButtonProps> = ({ href, type }) => {
	const router = useRouter();
	if (type === 'download') {
		return (
			<Anchor
				href={href}
				className={concat(classes['container'], classes[type])}
				download
			>
				<Icon type={'download'} />
				{type}
			</Anchor>
		);
	} else if (type === 'create') {
		return (
			<Anchor
				href={href}
				className={concat(classes['container'], classes[type])}
			>
				<Icon type={'add'} />
				{type}
			</Anchor>
		);
	}

	const onClick = async () => {
		try {
			await publicAPI.get('/verify', {
				withCredentials: true,
			});
			const resp = await publicAPI(href, {
				method: 'DELETE',
			});
			console.log(resp.data);
			alert(`Deleted.`);
			router.push('/');
		} catch (error) {
			console.error(error);
			alert('Error when deleting.');
		}
	};

	return (
		<button
			className={concat(classes['container'], classes[type])}
			onClick={onClick}
		>
			<Icon type={'clear'} />
			{type}
		</button>
	);
};

export default Button;
