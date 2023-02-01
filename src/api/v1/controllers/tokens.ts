import { Request } from "express";
import * as tokenServices from "../services/tokens.services";


export const generateTokens = async (req: Request) => {
    const count = req.query.tokens;
    const tokens = tokenServices.generateMultipleTokens(count);
    await tokenServices.saveTokens(tokens);
    return {
        created: Date.now(),
        token: tokens
    }
};

export const getTokenStatus = async (req: Request) => {
    const { token } = req.params;
    const tokenObject = await tokenServices.getToken(String(token));
    const tokenValidity = tokenServices.checkValidToken(tokenObject);
    const tokenExpired = await tokenServices.expireTokens(tokenObject, tokenValidity);
    return {
        status: tokenExpired ? 'expired' : tokenObject.status
    };
};

export const redeemToken = async (req: Request) => {
    const { token } = req.params;
    const tokenObject = await tokenServices.getToken(String(token));
    const tokenValidity = tokenServices.checkValidToken(tokenObject);
    const tokenExpired = await tokenServices.expireTokens(tokenObject, tokenValidity);
    await tokenServices.redeemToken(tokenExpired, tokenObject);
    return {
        result: 'ok'
    };
}