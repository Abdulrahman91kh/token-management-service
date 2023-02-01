import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => {
	throw new Error(err.message);
});

// encabsulate the function to make the module
export const connectClient = () => client.connect();

// encabsulate the function to make the module testable
export const closeConnection = () => client.disconnect();

export default client;
