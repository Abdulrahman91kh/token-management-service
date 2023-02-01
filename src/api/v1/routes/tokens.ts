import express, { NextFunction, Request, Response } from "express";
import { handler } from ".";
import { getTokenStatus, generateTokens, redeemToken } from "../controllers/tokens";
const router = express.Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => {
    handler({
        req, res, next, 
        fn: () => generateTokens(req)
    });
});

router.get('/:token', (req: Request, res: Response, next: NextFunction) => {
    handler({
        req, res, next, 
        fn: () => getTokenStatus(req)
    });
});

router.put('/redeem/:token', (req: Request, res: Response, next: NextFunction) => {
    handler({
        req, res, next, 
        fn: () => redeemToken(req)
    });
});

export default router;