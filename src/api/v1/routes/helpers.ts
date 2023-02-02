import { Response } from "express";
import CustomError from "../config/custom-error";
import { RouterHandlerInput } from "./types/router";

export const errorHanlder = (
	error: any,
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



/**
 * This function is responsible of 
 * 1. wraps all the incoming requests in a single try and catch
 * 2. Unifying the response scheme for all requests
 * to catch any expected errors and pass it to the ErrorHandlers middleware
 * @param param0 
 */

 export const handler = async ({
	req: { params, query },
	res,
	next,
	fn,
}: RouterHandlerInput) => {
	try {
		const controllerResponse = await fn(
			{ params, query },
			res
		);
		res.status(200).json({
			...controllerResponse
		});
	} catch (error) {
		errorHanlder(error, res);
	}
};