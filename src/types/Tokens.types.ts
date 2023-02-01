import QueryString from 'qs';

export type TokenStatus = 'available' | 'redeemed' | 'expired';

export interface Token {
    createdAt: number;
    token: string;
    status: TokenStatus;
};

export interface TokenValidity {
    valid: boolean;
    status: TokenStatus;
};

export type QueryStringParam = string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined;