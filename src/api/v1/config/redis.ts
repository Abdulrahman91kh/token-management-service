import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => {
	throw new Error(err.message);
});

export const connectClient = () => client.connect();

export const closeConnection = () => client.disconnect();
export default client;
