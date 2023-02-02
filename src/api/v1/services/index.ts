import { GetTokensResponse, QueryStringParam, Token } from "../../../types/tokens";
import dotenv from 'dotenv';
import { insertToken, retrieveToken, updateTokenStatus } from "../storage/redis";
import { checkIsAvailable, checkIsTokenExpired, generateToken } from "./util";
import CustomError from "../config/custom-error";
import { RedisCommandRawReply } from "@redis/client/dist/lib/commands";
dotenv.config();


/**
 * Generates a specific number of tokens
 * @param count 
 * @returns 
 */
export const generateTokens = (count: QueryStringParam = "1"): GetTokensResponse => {
    if(typeof count !== 'string') {
        throw new CustomError(400, 'Insufficient Query String, tokens count in query string "?tokens=<NUMERIC_VALUE>" is missing ');
    }
    const numericCount = parseInt(count);
    /**
     * Validating having an actual number, can be done using a middleware, but it is not necessary for this simple task
     * So we will do it manually for the simplicity sake.
     */
    if(isNaN(numericCount)) {
        throw new CustomError(422, 'Not valid tokens count in the query string "?tokens=<NUMERIC_VALUE>"', count);
    }
    const tokens = [];
    for(let i = 0; i < numericCount; i++ ){ 
        // Call helper function generateToken
        tokens.push(generateToken());
    }
    const ids = tokens.map(token => token.id);
    return {tokens, ids};
}

/**
 * Saves an array of tokens in the redis storage
 * @param tokens 
 * @returns 
 */
export const saveTokens = (tokens: Token[]): Promise<RedisCommandRawReply>[] => tokens.map(token => insertToken(token));

/**
 * Get Token details or throw 404 if not found
 * @param token 
 */
export const getToken = async (id: string): Promise<Token> => {
    const token = (await retrieveToken(id) ) as unknown as Token; // I think there is better approach
    if(!token.status) {
        throw new CustomError(404, 'Token is not found', id);
    }
    return {...token, id}; 
};

/**
 * Checks if the token is valid or not and return the current status
 * @param token Token object to check validity
 * @param token.id time of token creation
 * @param token.createdAt time of token creation
 * @param token.status current status of the token
 * @returns 
 */
export const checkValidToken = (token: Token): boolean => {
    if(!checkIsAvailable(token)) {
        return false;
    }
    const expireAfter = String(process.env.TTL_IN_DAYS);
    if(checkIsTokenExpired(token.createdAt, Number(expireAfter))) {
        return false;
    }
    return true;
};

/**
 * To expire tokens after a certain time of creation
 * This time can be configurable via env variables
 * @param token
 * @param boolean  
 * @returns 
 */
export const expireTokens = async (token: Token, isValid: boolean) => {
   if(token.status !== 'available')  {
        return false;
   };
   if(isValid) {
        return false;
   }
   await updateTokenStatus(token, 'expired');
   return true;
};

export const redeemToken = async (tokenExpired: boolean, token: Token): Promise<void> => {
    let { status } = token;
    if(tokenExpired || status !== 'available') {
        status = tokenExpired ? 'expired' : status;
        throw new CustomError(410, `Cannot redeem this token as it is already ${status}`, status);
    }
    await updateTokenStatus(token, 'redeemed');
};
