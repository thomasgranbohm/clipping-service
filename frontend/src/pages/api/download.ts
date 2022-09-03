import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const Handler = async (req, res) => {
	const { slug } = req.query;
	try {
		return res.redirect(
			`${publicRuntimeConfig.EXTERNAL_BACKEND_URL}/clip/${slug}/download`
		);
	} catch (error) {
		return res.status(500).send('Internal server error');
	}
};

export default Handler;
