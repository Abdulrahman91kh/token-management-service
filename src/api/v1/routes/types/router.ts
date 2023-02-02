import { NextFunction, Request, Response } from "express";

export interface RouterHandlerInput {
	req: Request;
	res: Response;
	next: NextFunction;
	fn: Function;
}