#!/usr/bin/env node

var amqp = require('amqplib');
const finnhub = require('finnhub');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "c6e4482ad3idg95up3rg" // Replace this
const finnhubClient = new finnhub.DefaultApi()


var message = "";

finnhubClient.symbolSearch('AAPL', (error, data, response) => {
  message = JSON.stringify(data);

  amqp.connect('amqp://localhost').then(function(conn) {
      return conn.createChannel().then(function(ch) {
          var ex = 'logs';
          var ok = ch.assertExchange(ex, 'fanout', {durable: false})

          return ok.then(function() {
            ch.publish(ex, '', Buffer.from(message));
            // console.log(" [x] Sent '%s'", message);        
            return ch.close();
          });
        }).finally(function() { conn.close(); });
    }).catch(console.warn);
});


