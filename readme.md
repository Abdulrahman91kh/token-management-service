# Token Management Service
## Summary
- This service manages tokens that can be used between the existing systems. By token management we mean 
  1. Tokens Generation
  2. Checking a Token Status
  3. Redeeming a Token
## Installation & Setup (Docker)
- To start the project with docker, you will need to install both of [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/) on your machine.
- Now navigate to the service root folder
- Use the following command to start the service
  ```
  docker-compose up -d
  ```
- To shutdown the service use the command 
  ```
  docker-compose down
  ```
## Installation & Setup (Without Docker)
- You will need to have [node & npm installed](https://nodejs.org/en/download/) on your machine before starting the installation process.
- You will have to have [redis installed](https://redis.io/download/) on you machine as well.
- Navigate to the service root folder.
- Make a copy of the `.env.example` file under the name of `.env`.
- Configure the environment variables in the .env file.
- This service was updated to node 18.13.0.
- Use the following commands to start the service
  ```
  npm i
  npm start
  ```
- **Note** Don't forget to update the redis port in the env file according to the installation on your machine.

## Testing
- This service exposes a public API that can be accessible with any client.
- To test the service you will find a folder named `postman` in the service root folder contains both a collection and environment files for postman.
- Import the two files mentioned earlier and ensure that the correct environment file is selected.
- Within the postman collection, you will find the requests that you can send to the API and examples of how the API is expected to behave.
- **Note** By default this API is running on port 4001, unless you change it via `.env` file if no docker was involved or via the docker-compose file.


## Solution Approach
- This service is following layered functional programming approach. To handle user's requests the following layers are used sequentially:
  1. Router (responsible for assigning middleware and a controller to handle the request).
  2. Controller (responsible for handling requests inputs and data between services and dispatching services).
  3. Services (responsible for the business logic and throwing errors).
  4. Storage (responsible for caching data into redis).
## Suggestions for enhancement
1. User infrastructure as a code such as (CDK).
2. Use better logger library such as ([Pino](https://www.npmjs.com/package/pino)) to generate better logs that can help to fix issues.
3. Unify all the API responses scheme.
4. Since we are using express in this service, and express can serve more than an API, I would suggest adding `/api/` as base to the API URL.
5. Changes to the Request structure to follow the Restful API standards by:
  - Changing the token generation endpoint to be as following: 
    ```
      {
        "url": "/tokens",
        "method": "POST",
        "body": {
          "count": 100
        }
      }
    ```
    and the response should have status code of `201 Created` on success.
  - Changing the token checking endpoint to be as following: 
    ```
    {
      "url": "/tokens/:id?fields=status",
      "method": "GET"
    }
    ```
  - Changing the redemption endpoint to be as following:
  ```
  {
    "url": "/tokens/redeem/:id",
    method: "PUT"
  }
  ``` 
6. When creating multiple tokens, we can may consider using redis MULTI or redis pipelining to save the trip time from the node app to redis per each insert command.
## Concerns & Questions
1. Using redis "MULTI" or redis pipelining may cause other redis clients in other containers to be blocked, does it block the redis I/O? Some investigation needed here.
2. The API is public, some authentication is needed here. May be simple API key would do the job.
