import { Request } from "express";
import * as tokenServices from "../services/tokens.services";


export const generateTokens = async (req: Request) => {
    const count = req.query.tokens;
    const tokens = tokenServices.generateMultipleTokens(count);
    await tokenServices.saveTokens(tokens);
    return {
        message: 'Tokens was generated successfully',
        data: tokens
    }
};

export const getTokenStatus = async (req: Request) => {
    const { token } = req.params;
    const tokenObject = await tokenServices.getToken(String(token));
    const tokenValidity = tokenServices.checkValidToken(tokenObject);
    const tokenExpired = await tokenServices.expireTokens(tokenObject, tokenValidity);
    return {
        message: 'Token was retrieved successfully',
        data: tokenExpired ? 'expired' : tokenObject.status
    };
};

export const redeemToken = async (req: Request) => {
    const { token } = req.params;
    const tokenObject = await tokenServices.getToken(String(token));
    const tokenValidity = tokenServices.checkValidToken(tokenObject);
    const tokenExpired = await tokenServices.expireTokens(tokenObject, tokenValidity);
    await tokenServices.redeemToken(tokenExpired, tokenObject);
    return {
        message: 'Token was redeemed successfully',
        data: 'ok'
    };
}