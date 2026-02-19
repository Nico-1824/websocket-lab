This is a project to stand up a websocket server.
It will start a server and the webpage that has a messaging service built on top of the websocket to emulate a chat room for users.

The client server is stood up when the webpage is opened automatically and all clients connected to the server will be notified when someone joins.
You are capped at 256 characters in a message and that message will be sent encoded with a super secret encription algorithm. Users will recieve the encoded message. To decode the message you can press the decode button and it will be live translated. 

To run the server:
    This service has been set up in a Docker container to make it really easy and make it work on any system. However to use Docker to standup, you must have docker installed...

    1. Simply build: docker build -t websocket .
    2. Then run docker run -p 5500:5500 -d websocket

    Done!

Otherwise:

    Run these commands to do it manually:
        1. npm install (to install the node packages to run the services)
        2. node server.js 

    Done!
