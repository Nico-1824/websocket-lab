## OVERVIEW:
This is a project to stand up a websocket server.
It will start a server and the webpage that has a messaging service built on top of the websocket to emulate a chat room for a user.

The client server is stood up when the webpage is opened automatically and you are capped at 256 characters in a message and that message will be sent encoded with a super secret encryption algorithm (changing the ASCII by 1). The server will receive the message, encode it, and then return the encoded message. To decode the message you can press the decode button and it will be live translated. 

## STRUCTURE:
- client.js - frontend JavaScript
- server.js - backend server logic
- Dockerfile - container setup
- index.html - main webpage
- styles.css - styling

## HOW TO RUN
This service has been set up in a Docker container to make it really easy and make it work on any system. However to use Docker to standup, you must have docker installed...

```bash
1. Simply build: docker build -t websocket .
2. Then run: docker run -p 5500:5500 -d websocket
3. Use this command to isolate the container name: docker ps -a
4. Start the container: docker start CONTAINER_NAME
```

Open up a broswer tab with this url:
http://localhost:5500/

Now feel free to start chatting with the server and decode the messages!

Otherwise:
Run these commands to do it manually:

```bash
1. npm install (to install the node packages to run the services)
2. node server.js
```

Done!

## DEPENDENCIES
Managed with package.json
