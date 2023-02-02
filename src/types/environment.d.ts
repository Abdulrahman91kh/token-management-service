declare global {
    namespace NodeJS {
      interface ProcessEnv {
          PORT: string;
          TTL_IN_DAYS: string;
          REDIS_URL: string;
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {};