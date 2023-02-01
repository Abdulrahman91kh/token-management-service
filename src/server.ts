import main from './app';
import { connectClient } from './api/v1/config/redis';
/**
 * Start the express webserver
 */
connectClient();
main();
