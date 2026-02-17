// Express websocket server
// 


const http = require("http");
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const PORT  = 5500;

const server = http.createServer((req, res) => {
    const filePath = ( req.url === '/') ? 'index.html' : req.url;

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    if (extname === '.js') contentType = 'text/javascript';
    else if (extname === '.css') contentType = 'text/css';

    // pipe the proper file to the res object
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(`${__dirname}/${filePath}`, 'utf8').pipe(res);
});




//////////////////////////////////////////////////////
// WEBSOCKET LOGIC
//////////////////////////////////////////////////////

const wsServer = new WebSocket.Server({ server: server});

wsServer.on("connection", (socket) => {
    console.log("New Client Connected!");

    //////////////////////////////////////////////////////
    // FUNCTION WHEN A CLIENT SENDS DATA
    //////////////////////////////////////////////////////

    socket.on("message", (data) => {
        clientData = JSON.parse(data);
        console.log("Message recieved: " + clientData.message);
        const newData = processData(clientData.message);

        broadcast(newData, socket);
    })
})




//////////////////////////////////////////////////////
// FUNCTION TO PROCESS THE DATA INTO ENCODING
//////////////////////////////////////////////////////
function processData(data) {
    let result = "";

    for (let i = 0; i < data.length; i++) {
        const char = data[i];
        const ascii = char.charCodeAt(0); // get ASCII code
        const newChar = String.fromCharCode(ascii + 1); // add 1
        result += newChar;
    }

    return result;
}






//////////////////////////////////////////////////////
// BROADCAST FUNCTION
//////////////////////////////////////////////////////

function broadcast(data, socketToOmit) {
    const response = {
        "message": data,
    }
    wsServer.clients.forEach(connectedClient => {
        if(connectedClient.readyState === WebSocket.OPEN && connectedClient !==  socketToOmit) {
            connectedClient.send(JSON.stringify(response));
        }
    });
};



//////////////////////////////////////////////////////
// STARTING THE WEBSOCKET SERVER ON PORT
//////////////////////////////////////////////////////

server.listen(5500, () => {
    console.log(`Listening on: http://localhost:${server.address().port}`)
})