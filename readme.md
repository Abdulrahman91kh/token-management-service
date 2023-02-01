# Token Management Service
## Summary
- This service manages tokens that can be used between Fabacus systems. By token management we mean 
  1. Tokens Generation
  2. Checking a Token Status
  3. Redeeming a Token
## Installation & Setup (Docker)


## Installation & Setup (Without Docker)

## Testing


## Improvements
1. User infrastructure as a code such as (CDK).
2. Use better logger library such as (Pino) to generate better logs.
3. Unify all the API responses scheme.
4. Changes to the Request structure to follow the Restful API standards.
5. When creating multiple tokens, we can may consider using redis MULTI or redis pipelining to save the trip time from the node app to redis per each insert command.
## Concerns & Questions
1. Using redis "MULTI" or redis pipelining may cause other redis clients in other containers to be blocked, does it block the redis I/O? Some investigation needed here.
2. The API is public, some authentication is needed here. May be simple API key would do the job.

