// This will be the client websocket recieving from the server
let wsClient;

const messageBox = document.querySelector("input");
const messageForm = document.querySelector("form");
const display = document.querySelector(".text-display");
const decodeButton = document.querySelector("button");

let lastReceived = "";
let id = 1;



//////////////////////////
// FUNCTION TO DISPLAY MESSAGES
//////////////////////////

function showMessage(message) {
    const messageBubble = document.createElement("div");
    messageBubble.classList.add("messages");
    messageBubble.id = id;
    id++;

    const userMessage = document.createTextNode(`YOU: ${message}`);
    messageBubble.appendChild(userMessage);

    display.appendChild(messageBubble);
}



//////////////////////////
// FUNCTION TO DISPLAY MESSAGES FROM SERVER (OTHER CLIENTS)
//////////////////////////

function showMessageFromServer(message) {
    const messageBubble = document.createElement("div");
    messageBubble.classList.add("messages");
    messageBubble.id = id;
    id++;

    const userMessage = document.createTextNode(`USER: ${message}`);
    messageBubble.appendChild(userMessage);

    display.appendChild(messageBubble);
}




////////////////////////////////////////////////////
// REPLACING A MESSAGE THAT IS DECODED
////////////////////////////////////////////////////

function replaceMessage(id, message) {
    const messageUser = document.getElementById(`${id - 1}`);
    messageUser.textContent = `USER: ${message}`;
}





/////////////////////////////////////////////////////
// SUBMIT FOR THE FORM TO SEND DATA TO THE WEBSOCKET
/////////////////////////////////////////////////////

messageForm.onsubmit = function(e) {
    e.preventDefault();

    const message = messageBox.value;
    if(message.length > 256) {
        messageBox.value = " Message is too long";
        return;
    }

    let response = {
        "message": message,
        "id": id
    }

    if (wsClient && wsClient.readyState === WebSocket.OPEN) {
        // showMessage(response.message);
        const serverResponse = JSON.stringify(response);
        wsClient.send(serverResponse);
    }

    messageBox.value = "";
}






//////////////////////////
// DECODE BUTTON FUNCTION
//////////////////////////

decodeButton.onclick = function(e) {
    let decoded = "";
    console.log("Last Revieved" + lastReceived);

    for (let i = 0; i < lastReceived.length; i++) {
        const char = lastReceived[i];
        const ascii = char.charCodeAt(0); // get ASCII code
        const newChar = String.fromCharCode(ascii - 1); // add 1

        decoded += newChar;
    }

    replaceMessage(id, decoded);
}







//////////////////////////
// INIT FUNCTION TO START THE WEBSOCKET
//////////////////////////

function init() {

    // check if the client is open and if so close it
    if(wsClient) {
        wsClient.onerror = wsClient.onopen = wsClient.onclose = null;
        wsClient.close();
    }

    const URL = 'ws://localhost:5500';
    wsClient = new WebSocket(URL);

    wsClient.onopen = () => {
        const response = {
            "message":"Welcome new User",
        }
        wsClient.send(JSON.stringify(response));
    }

    wsClient.onmessage = (messageEvent) => {
        // make it update the text area
        const data = JSON.parse(messageEvent.data);
        lastReceived = data.message;
        showMessageFromServer(data.message);
        
    }

    wsClient.onclose = (event) => {
        wsClient = null;
    }

    wsClient.onerror = (event) => {
        console.error("Websocket error: " + event);
        wsClient = null;
    }
}

init();