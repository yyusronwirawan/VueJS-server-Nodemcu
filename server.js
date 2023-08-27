'use strict'

const websocket = require('ws');

const wss = new websocket.Server({
    port: 8080
});

let CLIENTS = [];
var counterClient = 0;

wss.on("connection", (ws) => {
    // ws.send("test 1");    
    counterClient += 1;
    console.log(counterClient + " client connected");
    ws.on("message", (data) => {
        let message;
        try {
            message = JSON.parse(data);
        } catch (error) {
            sendError(ws, "data harus dalam bentuk json");
            return;
        }
        CLIENTS[message.device_type] = ws;
        console.log(message);
        // if(message.type === "NEW_MESSAGE"){            
            // console.log(wss.clients.forEach);
            // wss.clients.forEach((client) => {
            //     console.log(client);
            //     if(client.readyState == websocket.OPEN){
            //         // console.log(client);
            //         client.send(data);
            //     }
            // });
            if(message.device_type === "nodemcu"){
                console.log(message.data_sensor);
                CLIENTS["pc-client"].send(message.data_sensor);
            }            
        // }
    })
})

const sendError = (ws, message) => {
    const messageObject = {
      type: 'ERROR',
      payload: message,
    };
  
    ws.send(JSON.stringify(messageObject));
};