
<h1>This is  with NodeJS+Express+MongoDB/Mongoose starter kit </h1.
It uses babel to create build so you are free to use import, spread, classes and ES2017 fetures
 in your project.
 
 ---
  ## Table of contents
  * [Scripts](#scripts)
  * [Folder structure](#folder-structure)
  * [Locators](#locators)
  * [Logging](#logging)
  * [Mailing](#mailing)
  * [Authentication](#authentication)
  

## Scripts

 <b>"dbUp"</b> - make migratin for initial DB state,<br/>
 <b>"clean"</b> - clean build folder,<br/>
 <b>"start"</b> - create build and run nodeMon to watch changes,<br/>
 <b>"buildServer"</b> - use babel to create build folder,<br/>
 <b>"nodemonServer"</b> - start watching for file changes in /src and re-run server,<br/> 
 <b>"server"</b> - run server from /build without watching for changes.<br/>


## Folder structure

  <b>config</b> - configuration files<br/>
  <b>logs</b> - folder for log4js logs<br/>
  <b>migrations</b> - migrations for db<br/>
  <b>src/constants</b><br/>
  <b>src/controllers</b><br/>
  <b>src/converter</b> - data converter to read/write from/in DB<br/>
  <b>src/error</b> - user error handler<br/>
  <b>src/middleware</b> - different middleware (e.g authenticateMiddleware)<br/> 
  <b>src/models</b> - db models for mongoose schema<br/>
  <b>src/routes</b> - application route functions<br/>
  <b>src/templates</b> - mail templates<br/>
  <b>src/util</b> - custom utilities<br/>
  <b>src/view</b> - application pages<br/>
  
  
## Locators

   There are ServiceLocator and ModelLocator used. Please read this article if you are not 
   familiar with this design pattern https://msdn.microsoft.com/en-us/library/ff648968.aspx 
      
  
## Logging
  
  log4js configured to write log. It creates two files .csv and .log.with same data. CSV created 
  for more convenient way to filtering and sorting logs with Excel spreadsheet. 
  To track every request from receiving on the server and up to response there is requestMiddlewre
   applied using utils/getUniqueIdentifier utility to attache unique ID (md5 generator used) to 
   req object and release it as request to the user send. It use object pool to keep all ID 
   currently processing on the server. After processing it release ID from pool. So you may 
  track time taking every request (use filter and sorting in CSV file ). As well you may find ID that 
  were not released for some reason and stuck in our pool so transaction was not processed by 
  server. You want to investigate reasons of such cases to find failed scenarios.  
  
  
## Mailing
   
   Popular module nodemailer uses to send emails to user. For initial project it uses to recover 
   user password. Email templates located in src/templates folder
   
   
## Authentication
  
  You may login with userName/Password or use  authentication provider as facebook.
  