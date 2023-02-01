import { Token, TokenStatus } from "../../../types/Tokens.types";
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

export const updateTokenStatus = ({token, createdAt}: Token, newStatus: TokenStatus) =>  Client.sendCommand([
	"HSET",
	`${token}`,
	"createdAt",
	`${createdAt}`,
	"status",
	`${newStatus}`,
]);