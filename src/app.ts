import express, { Express } from "express";
import * as dotenv from 'dotenv';
import { errorHanlder, notFoundHandler } from "./api/v1/middlewares/ErrorHandlers";
import routes from "./api/v1/routes";
dotenv.config();

/**
 * This funciton will start the express server
 * and add all the requried middleware
 * @returns 
 */
export default () => {
    return new Promise((resolve) => {

        const app = express() as Express;
        
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        
        //routes
        app.use("/api", routes);
        
        app.use(errorHanlder);
        app.use(notFoundHandler);

        const { PORT } = process.env;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            resolve(0);
        });
    });
}

