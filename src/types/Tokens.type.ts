export type TokenStatus = 'available' | 'redeemed' | 'expired';

export interface Token {
    createdAt: number;
    token: string;
    status: TokenStatus;
};