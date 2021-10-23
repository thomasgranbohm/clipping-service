import ClipCreator from 'components/ClipCreator/ClipCreator';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { privateAPI, publicAPI } from 'utils/api';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	if (query.key) {
		try {
			const { data } = await privateAPI(`/items/${query.key}`);

			return {
				props: data,
			};
		} catch (err) {
			return {
				props: {},
			};
		}
	}
	return {
		props: {},
	};
};

const CreatePage = ({ key, details }) => {
	const [keyInput, setKeyInput] = useState<string>();
	const [detailState, setDetailState] = useState(details);

	return (
		<div>
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
		</div>
	);
};

export default CreatePage;
