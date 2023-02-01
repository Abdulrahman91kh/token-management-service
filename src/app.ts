import express, { Express } from "express";
import * as dotenv from 'dotenv';
import { notFoundHandler } from "./api/v1/middlewares/ErrorHandlers";
import routes from "./api/v1/routes";
import * as Redis from "./api/v1/config/redis";
dotenv.config();

/**
 * Closes the redis connection in case of closing the server
 * @param app 
 */
export const handleCloseConnections = (app: Express): void => {
    app.on('close', () => Redis.closeConnection());
    process.on( 'SIGTERM', function () {
        Redis.closeConnection()
    });
};

/**
 * This funciton will start the express server
 * and add all the requried middleware
 * @returns 
 */
export default (): Promise<void> => {
    return new Promise((resolve) => {

        const app = express() as Express;
        
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        
        app.use("/api", routes);
        
        app.use(notFoundHandler);

        const { PORT } = process.env;
        handleCloseConnections(app);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            resolve();
        });
    });
}

