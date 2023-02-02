import express, { NextFunction, Request, Response } from "express";
import { getTokenStatus, generateTokens, redeemToken } from "../controllers";
import { handler } from "./helpers";
const router = express.Router();

router.post('/generate', (req: Request, res: Response, next: NextFunction) => {
    handler({
        req, res, next, 
        fn: () => generateTokens(req.query.tokens)
    });
});

router.get('/check/:id', (req: Request, res: Response, next: NextFunction) => {
    handler({
        req, res, next, 
        fn: () => getTokenStatus(req.params.id)
    });
});

router.put('/redeem/:id', (req: Request, res: Response, next: NextFunction) => {
    handler({
        req, res, next, 
        fn: () => redeemToken(req.params.id)
    });
});

export default router;