import { QueryStringParam, Token, TokenValidity } from "../../../types/Tokens.types";
import dotenv from 'dotenv';
import { insertToken, retrieveToken, updateTokenStatus } from "../storage/redis.model";
import { checkIsTokenExpired, generateToken } from "./util";
import CustomError from "../config/CustomError";
import { RedisCommandRawReply } from "@redis/client/dist/lib/commands";
dotenv.config();


/**
 * Generates a specific number of tokens
 * @param count 
 * @returns 
 */
export const generateMultipleTokens = (count: QueryStringParam): Token[] => {
    /** 
     * Required query string paramter the number of tokens to be created
     * I'll assume for this example that it is a mandatory paramter to keep the consistancy of the requests scheme
     * We can ignore it and just create one token if it is not exists but I'm not happy with that.
     * So we will through bad request if the count does not exist
     **/
    if(typeof count !== 'string') {
        throw new CustomError(400, 'Insuffecient Query String, tokens count in query string "?tokens=<NUMERIC_VALUE>" is missing ');
    }
    const numbericCount = parseInt(count);
    /**
     * Validating having an actual number, can be done using a middleware, but it is not necessary for this simple task
     * So we will do it manually for the simplicity sake.
     */
    if(isNaN(numbericCount)) {
        throw new CustomError(422, 'Not valid tokens count in the query string "?tokens=<NUMERIC_VALUE>"', count);
    }
    const tokens = [];
    for(let i = 0; i < numbericCount; i++ ){ 
        // Call helper function generateToken
        tokens.push(generateToken());
    }
    return tokens;
}

/**
 * Saves an array of tokens in the redis storage
 * @param tokenObjects 
 * @returns 
 */
export const saveTokens = (tokenObjects: Token[]): Promise<RedisCommandRawReply>[] => tokenObjects.map(tokenObject => insertToken(tokenObject));

/**
 * Get Token details or throw 404 if not found
 * @param token 
 */
export const getToken = async (token: string): Promise<Token> => {
    const tokenObject = (await retrieveToken(token) ) as unknown as Token; // I think there is better approach
    if(!tokenObject.status) {
        throw new CustomError(404, 'Token is not found', token);
    }
    return {
        token,
        createdAt: typeof tokenObject.createdAt === 'string' ? parseInt(tokenObject.createdAt) : tokenObject.createdAt,
        status: tokenObject.status
    }; 
};

/**
 * Checks if the token is valid or not and return the current status
 * @param tokenObject Token object to check validity
 * @param tokenObject.createdAt time of token creation
 * @param tokenObject.status current status of the token
 * @returns 
 */
export const checkValidToken = ({createdAt, status}: Token): TokenValidity => {
    let notExpired = true; 
    // convert from days to timestamp
    const expireAfter = String(process.env.EXPIRE_AFTER_DAYS); // I think there is better approach
    if( status ==='available' && checkIsTokenExpired(createdAt, Number(expireAfter)) ) {
        notExpired = false;
    }
    return {valid: notExpired && status === 'available', status};
};

/**
 * To expire tokens after a certin time of creation
 * This time can be configurable via env variables
 * @param token
 * @param TokenValidity  
 * @returns 
 */
export const expireTokens = async (token: Token, {valid, status}: TokenValidity) => {
    // the token is expired but need to be updated
   if(valid || status !== 'available')  {
        return false;
   };
   // update the token
   await updateTokenStatus(token, 'expired');
   return true;
};

export const redeemToken = async (tokenExpired: boolean, tokenObject: Token): Promise<void> => {
    let { status } = tokenObject;
    if(tokenExpired || status !== 'available') {
        status = tokenExpired ? 'expired' : status;
        throw new CustomError(410, `Cannot redeem this token as it is already ${status}`, status);
    }
    await updateTokenStatus(tokenObject, 'redeemed');
};
