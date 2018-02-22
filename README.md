This is start kit for NodeJS project with MongoDB/Mongoose.
It uses babel to create build so you are free to use import, spread, classes and ES2017 fetures
 in your project. 

npm scrips:
 "dbUp" - make migratin for initial DB state,
 "clean" - clean build folder,
 "start" - create build and run nodeMon to watch changes,
 "buildServer" - use babel to create build folder
 "nodemonServer" - start watching for file changes in /src and re-run server 
 "server" - run server from /build without watching for changes


Folder structure:
  config:
  logs - log4js configured to write logs in this folder
  migrations - migrations for db
  src/constants
  src/controllers
  src/converter - data converter to read/write from/in DB
  src/error - user error handler
  src/middleware - different middleware (e.g authenticateMiddleware) 
  src/models - db models for mongoose schema
  src/routes - application route functions 
  src/templates - mail templates
  src/util - custom utilites you use in the project
  src/view - pages of application