# CS50x Final project - small messenger.

## Install nvm
https://github.com/coreybutler/nvm-windows

## Description

This repo contains the last project for CS50x course. It consists of 3 main parts:
1. Next.js application
2. REST API 
3. WS API

Next.js contains all the ```static``` that user would see in the browser
Rest API is used for simple REST API calls, like creating/updating users and so on.
WS is used for messaging and instant update of the messages on UI side 
(this choice was made only for study purposes, probably SSE would be better in this case, just for text messages)

## Running
1. go to ```server/src/db``` and check ```schema.sql```, ```init.sql```.
2. Execute ```init.sql``` to create db and user and ```schema.sql``` to create db_schema (seed is created to be used with PostgresSQL)
3. Install dependencies with ```npm i```
4. Run server ```npm start:server```
5. Run ui ```npm start:ui```

## Testing
To run test ```npm run test```

