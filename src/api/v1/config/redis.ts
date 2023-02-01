import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => {
	throw new Error(err.message);
});

export const connectClient = async () => {
	await client.connect();
};

export default client;
