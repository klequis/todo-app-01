# Experss Server Part II

> This is most likely a temporary project.
> It is part of a book project and will be incorporated into it in the future.

## Routes
- POST 'api/todo'
- GET 'api/todo'
- GET 'api/todo/:id'
- DELETE 'api/todo/:id'
- UPDATE - _pending_

## Database functions

- connectDB
- close
- formatReturnSuccess
- formatReturnError
- logError
- insertMany
- dropCollection
- insertOne
- find
- findById
- findOneAndDelete
- findOneAndUpdate

## Deployment process

May get shorter as app matures

01. Test with `npm start`
02. Test with `npm start-prod`
03. node `build-server`
04. cd to app and test with `NODE_ENV=production node server`
05. on server, pull changes
06. node `build-server.js`
07. copy settings.config.js to app/config
07. cd to app and start with `NODE_ENV=production node server`
08. curl http://localhost:3030/ping
08. start with `pm2 start ecosystem.config.js`
09. curl http://localhost:3030/ping
10. pm2 logs - look for errors




