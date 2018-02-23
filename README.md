**This is start kit with NodeJS+Express+MongoDB/Mongoose.
It uses babel to create build so you are free to use import, spread, classes and ES2017 fetures
 in your project.**
 
  

**npm scrips:**

 "dbUp" - make migratin for initial DB state,
 "clean" - clean build folder,
 "start" - create build and run nodeMon to watch changes,
 "buildServer" - use babel to create build folder
 "nodemonServer" - start watching for file changes in /src and re-run server 
 "server" - run server from /build without watching for changes


**Folder structure:**

  config:
  logs - folder for log4js logs
  migrations - migrations for db
  src/constants
  src/controllers
  src/converter - data converter to read/write from/in DB
  src/error - user error handler
  src/middleware - different middleware (e.g authenticateMiddleware) 
  src/models - db models for mongoose schema
  src/routes - application route functions 
  src/templates - mail templates
  src/util - custom utilities
  src/view - application pages
  
  
**Locators**

   There are ServiceLocator and ModelLocator used. Please read this article if you are not 
   familiar with this design pattern https://msdn.microsoft.com/en-us/library/ff648968.aspx 
      
  
**Logging:**
  
  log4js configured to write log. It creates two files .csv and .log.with same data. CSV created 
  for more convenient way to filtering and sorting logs with Excel spreadsheet. 
  To track every request from receiving on the server and up to response there is requestMiddlewre
   applied using utils/getUniqueIdentifier utility to attache unique ID (md5 generator used) to 
   req object and release it as request to the user send. It use object pool to keep all ID 
   currently processing on the server. After processing it release ID from pool. So you may 
  track time taking every request (use filter and sorting in CSV file ). As well you may find ID that 
  were not released for some reason and stuck in our pool so transaction was not processed by 
  server. You want to investigate reasons of such cases to find failed scenarios.  
  
  
**Mailing**
   
   Popular module nodemailer uses to send emails to user. For initial project it uses to recover 
   user password. Email templates located in src/templates folder
   
   
**Authentication**
  
  You may login with userName/Password or use  authentication provider as facebook.
  