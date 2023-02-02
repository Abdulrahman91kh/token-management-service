import QueryString from 'qs';

export type TokenStatus = 'available' | 'redeemed' | 'expired';

export interface Token {
    createdAt: number;
    id: string;
    status: TokenStatus;
};

export type QueryStringParam = string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined;

export interface GetTokensResponse {
    tokens: Token[];
    ids: string[];
}