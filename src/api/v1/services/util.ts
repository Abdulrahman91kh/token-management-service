import { Token } from "../../../types/Tokens.types";
import { v4 as uuid } from 'uuid';

/**
 * Checks token expiry against number of days
 * @param tokenTimeStamp 
 * @param expiryAfterDays 
 * @returns boolean
 */
export const checkIsTokenExpired = (tokenTimeStamp: number, expiryAfterDays: number): boolean => {
    const tokenDate = new Date(tokenTimeStamp)
    tokenDate.setDate(tokenDate.getDate() + expiryAfterDays);
    return tokenDate.getTime() < Date.now();
};

/**
 * Generates basic token
 * @returns 
 */
export const generateToken = (): Token => ({
    createdAt: Date.now(),
    token: uuid(),
    status: 'available'
});