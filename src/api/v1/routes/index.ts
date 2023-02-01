import express from "express";
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
        console.log(res)
        console.log(res.status)
		res.status(200).json({
			message,
			data,
			status: "Success",
		});
	} catch (err) {
        console.log(err)
		next(err);
	}
};

router.use('/tokens', tokensRoutes);

export default router