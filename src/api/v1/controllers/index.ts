import { QueryStringParam } from "../../../types/tokens";
import * as tokenServices from "../services";

/**
 * 
 * @param count 
 * @returns 
 */
export const generateTokens = async (count: QueryStringParam) => {
    const {tokens, ids} = tokenServices.generateTokens(count);
    await Promise.all(tokenServices.saveTokens(tokens));
    return {
        created: new Date().toISOString(),
        token: ids,
    };
};

/**
 * 
 * @param id 
 * @returns 
 */
export const getTokenStatus = async (id: string) => {
    const token = await tokenServices.getToken(String(id));
    const isValid = tokenServices.checkValidToken(token);
    const tokenExpired = await tokenServices.expireTokens(token, isValid);
    return {
        status: tokenExpired ? 'expired' : token.status
    };
};

/**
 * 
 * @param id 
 * @returns 
 */
export const redeemToken = async (id: string) => {
    const token = await tokenServices.getToken(String(id));
    const tokenValid = tokenServices.checkValidToken(token);
    const tokenExpired = await tokenServices.expireTokens(token, tokenValid);
    await tokenServices.redeemToken(token, tokenExpired );
    return {
        result: 'ok'
    };
}