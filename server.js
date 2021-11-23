const express = require('express')
const app = express();
const http = require('http');
const server = http.createServer(app);
const WebSocketServer = require('websocket').server;
const amqp = require('amqplib');
const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "c6e4482ad3idg95up3rg"
const finnhubClient = new finnhub.DefaultApi();
const Subscriber = require('./subscriber.js');
const Producer = require('./producer.js');

const wsServer = new WebSocketServer({
    httpServer: server
});



Producer(finnhubClient, amqp, wsServer);
Subscriber(finnhubClient, amqp);

app.get('/companyNews', function(req, res){
    finnhubClient.companyNews("AAPL", "2021-11-01", "2021-11-20", (error, data, response) => {
      console.log(data);
      res.send(data);
    });
});


server.listen(3000);
