import ClipCreator from 'components/ClipCreator/ClipCreator';
import { GetServerSideProps } from 'next';
import { privateAPI } from 'utils/api';

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

const CreatePage = ({ details }) => (
	<div>
		<h1>Create Page</h1>
		<ClipCreator details={details} />
	</div>
);

export default CreatePage;
