import { Token, TokenStatus } from "../../../types/Tokens.type";
import { insertToken, retrieveToken, updateTokenStatus } from "../models/redis.model";
import dotenv from 'dotenv';
import { checkIsTokenExpired } from "./util";
dotenv.config();

export const generateToken = () => {
    return 'SAMPLE Token';
};

export const saveToken = (tokenObject: Token) => insertToken(tokenObject);

export const getToken = async (token: string) => {
    retrieveToken(token);
};

export const checkValidToken = async ({token, createdAt, status}: Token) => {
    let notExpired = true; 
    // convert from days to timestamp
    const expireAfter = parseInt(process.env.EXPIRE_AFTER_DAYS);
    if( status ==='available' && checkIsTokenExpired(createdAt, expireAfter) ) {
        notExpired = false;
    }
    return {valid: notExpired && status === 'available', status};
};


export const expireTokens = async (token: string, tokenValid: boolean, status: TokenStatus) => {
    // the token is expired but need to be updated
   if(tokenValid || status !== 'available')  {
        return false;
   };
   // update the token
   await updateTokenStatus(token, 'redeemed');
   return true;
};

export const redeemToken = async ({token, status}: Token) => {
    if(status !== 'available') {
        // Should have the status with a custom error to be delivered back
        throw new Error('not available');
    }
    await updateTokenStatus(token, 'redeemed');
};
