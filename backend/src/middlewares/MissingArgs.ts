import { NextFunction, Request } from 'express';

const MissingArgs =
	(args: string[]) => (req: Request, _, next: NextFunction) => {
		const missing_args = args.filter((arg) => arg in req.query === false);
		if (missing_args.length > 0) {
			throw {
				status: 500,
				message: `Missing arguments ${missing_args.join(', ')}.`,
			};
		}

		next();
	};

export default MissingArgs;
