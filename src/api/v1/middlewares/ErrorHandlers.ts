import { Request, Response, NextFunction } from 'express'

export const notFoundHandler = (
	req: Request,
	res: Response,
) => {
	res.status(404).json({
		status: "error",
		message: "Cannot find this Endpoint",
	});
};
