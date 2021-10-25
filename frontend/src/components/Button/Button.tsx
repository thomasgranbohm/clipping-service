import Anchor from 'components/Anchor/Anchor';
import Icon from 'components/Icon/Icon';
import { FC } from 'react';
import { publicAPI } from 'utils/api';
import { concat } from 'utils/functions';
import classes from './Button.module.scss';

type ButtonProps = {
	href: string;
	type: 'download' | 'delete';
};

const Button: FC<ButtonProps> = ({ href, type }) => {
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
	}

	const onClick = async () => {
		try {
			const resp = await publicAPI(href, {
				method: 'DELETE',
			});
			console.log(resp.data);
			alert(`Deleted.`);
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
