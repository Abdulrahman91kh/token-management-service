import { Token, TokenStatus } from "../../../types/Tokens.type";
import Client from "../config/redis";

export const insertToken =  ({token, createdAt, status}: Token) => Client.sendCommand([
	"HSET",
	`${token}`,
	"createdAt",
	`${createdAt}`,
	"status",
	`${status}`,
]);


export const retrieveToken = (token: string) =>  Client.HGETALL(`${token}`);

export const updateTokenStatus = (token: string, status: TokenStatus) =>  Client.HGETALL(`${token}`);
