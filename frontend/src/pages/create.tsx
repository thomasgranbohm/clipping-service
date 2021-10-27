import ClipCreator from 'components/ClipCreator/ClipCreator';
import Layout from 'components/Layout/Layout';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { privateAPI, publicAPI } from 'utils/api';

export const getServerSideProps: GetServerSideProps = async ({
	query,
	req,
}) => {
	try {
		if (!req.headers.cookie) throw new Error();
		await privateAPI('/verify', {
			headers: {
				cookie: req.headers.cookie,
			},
		});
	} catch (err) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		};
	}

	if (query.key) {
		try {
			const { data } = await privateAPI(`/items/${query.key}`);

			return {
				props: data,
			};
		} catch (err) {}
	}
	return {
		props: {},
	};
};

const CreatePage = (props) => {
	const { details } = props;
	const [keyInput, setKeyInput] = useState<string>();
	const [detailState, setDetailState] = useState(details);

	return (
		<Layout {...props}>
			<h1>Create Page</h1>
			{!detailState ? (
				<div className="search">
					<input
						type="text"
						name="key"
						id="key"
						placeholder="Metadata Key"
						value={keyInput}
						onChange={(e) => setKeyInput(e.target.value)}
					/>
					<button
						onClick={async (e) => {
							e.preventDefault();

							try {
								const { data } = await publicAPI(`/items/${keyInput}`);

								setDetailState(data['details']);
							} catch (error) {
								alert('Could not find clip with key: ' + keyInput);
								setKeyInput('');
							}
						}}
						type="submit"
					>
						Find episode
					</button>
				</div>
			) : (
				<ClipCreator details={detailState} />
			)}
		</Layout>
	);
};

export default CreatePage;
