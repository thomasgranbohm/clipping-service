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
			<a href={href} className={concat(classes['container'], classes[type])}>
				<Icon type={'download'} />
				{type}
			</a>
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
	} else if (type === 'delete') {
		return (
			<button
				className={concat(classes['container'], classes[type])}
				onClick={async () => {
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
				}}
			>
				<Icon type={'clear'} />
				{type}
			</button>
		);
	}
};

export default Button;
