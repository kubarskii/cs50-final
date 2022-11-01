# CS50x Final project - small messenger.

## Description

This repo contains the last project for CS50x course. It consists of 3 main parts:
1. Next.js application
2. REST API 
3. WS API

Next.js contains all the ```static``` that user would see in the browser
Rest API is used for simple REST API calls, like creating/updating users and so on.
WS is used for messaging and instant update of the messages on UI side 
(this choice was made only for study purposes, probably SSE would be better in this case, just for text messages)

You can watch the presentation by visiting the link: <link here>

## Running
1. go to ```src/db``` and check ```schema.sql```.
2. Execute ```schema.sql``` to create db_schema (seed is created to be used with PostgresSQL)
3. Install dependencies with ```npm i```
4. Run application ```npm start```

By default, the application is running on PORT ```80```.

## Testing
//TODO


