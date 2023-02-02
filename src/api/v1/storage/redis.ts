import { Token, TokenStatus } from "../../../types/tokens";
import Client from "../config/redis";

export const insertToken =  ({id, createdAt, status}: Token) => Client.sendCommand([
	"HSET",
	`${id}`,
	"createdAt",
	`${createdAt}`,
	"status",
	`${status}`,
]);

export const retrieveToken = <T> (id: string) =>  Client.HGETALL(`${id}`);

export const updateTokenStatus = ({id, createdAt}: Token, newStatus: TokenStatus) =>  Client.sendCommand([
	"HSET",
	`${id}`,
	"createdAt",
	`${createdAt}`,
	"status",
	`${newStatus}`,
]);