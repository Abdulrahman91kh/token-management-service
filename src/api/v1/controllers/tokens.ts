import { Request } from "express";
import { QueryStringParam } from "../../../types/tokens";
import * as tokenServices from "../services";


export const generateTokens = async (count: QueryStringParam) => {
    const {tokens, ids} = tokenServices.generateTokens(count);
    await tokenServices.saveTokens(tokens);
    return {
        created: Date.now(),
        token: ids,
    };
};

export const getTokenStatus = async (id: string) => {
    const token = await tokenServices.getToken(String(id));
    const isValid = tokenServices.checkValidToken(token);
    const tokenExpired = await tokenServices.expireTokens(token, isValid);
    return {
        status: tokenExpired ? 'expired' : token.status
    };
};

export const redeemToken = async (id: string) => {
    const token = await tokenServices.getToken(String(id));
    const tokenValidity = tokenServices.checkValidToken(token);
    const tokenExpired = await tokenServices.expireTokens(token, tokenValidity);
    await tokenServices.redeemToken(tokenExpired, token);
    return {
        result: 'ok'
    };
}