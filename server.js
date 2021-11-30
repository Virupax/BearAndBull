const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const WebSocketServer = require('websocket').server;
const amqp = require('amqplib');
const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "c6e4482ad3idg95up3rg"
const finnhubClient = new finnhub.DefaultApi();
const Producer = require('./producer.js');

const wsServer = new WebSocketServer({
    httpServer: server
});

Producer(finnhubClient, amqp, wsServer);

app.use(cors({
    origin: '*'
}));


app.get('/companyNews', function(req, res){
    finnhubClient.companyNews(req.query.symbol, "2021-11-29", "2021-11-29", (error, data, response) => {
      console.log(data);
      res.send(data);
    });
});


server.listen(3000);
