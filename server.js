
/*
TCP/Websocket server that listens on port 5500.
Accepts client connections and receives messages (max 256 characters).
Encodes each character by shifting +1 in the ASCII sequence.
Sends the encoded message back to the client.
*/

// Express websocket server
//////////////////////////// 
const http = require("http");
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');







//////////////////////////
// SERVER DECLARATION
//////////////////////////
const PORT  = 5500;
const server = http.createServer((req, res) => {
    try {
        if (req.url === '/favicon.ico') return res.end();

        const filePath = ( req.url === '/') ? 'index.html' : req.url;

        const extname = path.extname(filePath);
        let contentType = 'text/html';
        if (extname === '.js') contentType = 'text/javascript';
        else if (extname === '.css') contentType = 'text/css';

        // pipe the proper file to the res object
        const fullPath = path.join(__dirname, filePath);

        fs.readFile(fullPath, (err, content) => {
            if(err) {
                res.writeHead(404);
                return res.end("404 not found");
            }

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        });
    } catch (error) {
        console.log(error);
    }
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
// FUNCTION TO ENCODE THE MESSAGE
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
// BROADCAST FUNCTION BACK TO THE CLIENT THAT SENT MESSAGE AS WELL
//////////////////////////////////////////////////////

function broadcast(data, socketToOmit) {
    const response = {
        "message": data,
    }
    wsServer.clients.forEach(connectedClient => {
        if(connectedClient.readyState === WebSocket.OPEN && connectedClient ===  socketToOmit) {
            connectedClient.send(JSON.stringify(response));
        }
    });
};



//////////////////////////////////////////////////////
// STARTING THE WEBSOCKET SERVER ON PORT
//////////////////////////////////////////////////////

server.listen(PORT, () => {
    console.log(`Listening on: http://localhost:${server.address().port}`)
})
