const Handler = async (req, res) => {
	const { slug } = req.query;
	try {
		return res.redirect(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/clip/${slug}/download`
		);
	} catch (error) {
		return res.status(401).send('Nope');
	}
};

export default Handler;
