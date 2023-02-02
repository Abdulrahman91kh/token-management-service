import { Token } from "../../../types/tokens";
import { v4 as uuid } from 'uuid';

/**
 * Checks token expiry against number of days
 * @param tokenTime 
 * @param expiryAfterDays 
 * @returns boolean
 */
export const checkIsTokenExpired = (tokenTime: number, ttlDays: number): boolean => {
    const DAYS = 60 * 60 * 24 * 1000;
    return tokenTime + DAYS * ttlDays < Date.now();
};

/**
 * Generates basic token
 * @returns 
 */
export const generateToken = (): Token => ({
    createdAt: Date.now(),
    id: uuid(),
    status: 'available'
});

export const checkIsAvailable = (token: Token): boolean => token.status === 'available';
