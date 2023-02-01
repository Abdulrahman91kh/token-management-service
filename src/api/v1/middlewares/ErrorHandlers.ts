import { Request, Response, NextFunction } from 'express'
import CustomError from '../config/CustomError';

export const errorHanlder = (
	error: any, // I think there is better approach
	res: Response,
) => {
	const code = (error as CustomError).code ? parseInt(error.code) : 500;
	const message = (error as CustomError).message ? error.message : error;
	const { data } = (error as CustomError);
	if (code === 500) {
		console.error(`[ERROR: ${Date.now()}]`, error);
	}
	if(code === 410) {
		res.status(code).json({
			result: data,
		});
		return;
	}
	res.status(code).json({
		status: "error",
		message: code === 500 ? "Internal Server Error" : message,
	});
};

export const notFoundHandler = (
	req: Request,
	res: Response,
) => {
	res.status(404).json({
		status: "error",
		message: "Cannot find this Endpoint",
	});
};
