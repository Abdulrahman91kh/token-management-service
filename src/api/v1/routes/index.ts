import express from "express";
import { errorHanlder } from "../middlewares/ErrorHandlers";
const router = express.Router();
import tokensRoutes from './tokens';
import { RouterHandlerInput } from "./types/RoutesTypes";

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
		const {message, data} = await fn(
			{ params, query },
			res
		);
		res.status(200).json({
			message,
			data,
			status: "Success",
		});
	} catch (error) {
		errorHanlder(error, res);
	}
};

router.use('/tokens', tokensRoutes);

export default router