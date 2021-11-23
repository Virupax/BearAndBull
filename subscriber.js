function Subscriber(finnhubClient, amqp){
  var prevData;
  setInterval(function() {
    finnhubClient.quote('AAPL', (error, data, response) => {
      if(prevData != data.c){
        console.log(prevData);
        prevData = data.c;
        var message = JSON.stringify(data);

        amqp.connect('amqp://localhost').then(function(conn) {
          return conn.createChannel().then(function(ch) {
            var ex = 'logs';
            var queueChannel = ch.assertExchange(ex, 'fanout', {durable: false})

            return queueChannel.then(function() {
              ch.publish(ex, '', Buffer.from(message));
              return ch.close();
            });
          }).finally(function() { conn.close(); });
        }).catch(console.warn);
      }
    });
  }, 3000);
}

module.exports = Subscriber