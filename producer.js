function Producer(finnhubClient, amqp, websocketServer){
  websocketServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);

    connection.on('message', function(message) {
      var symbol = message.utf8Data;
    });
    
    connection.on('close', function(reasonCode, description) {
      console.log('Client has disconnected.');
    });

    amqp.connect('amqp://localhost').then(function(conn) {
      process.once('SIGINT', function() { conn.close(); });

      return conn.createChannel().then(function(channel) {
        var QueueChannel = channel.assertExchange('logs', 'fanout', {durable: false});

        QueueChannel = QueueChannel.then(function() {
          return channel.assertQueue('', {exclusive: true});
        });

        QueueChannel = QueueChannel.then(function(qQueueChannel) {
          return channel.bindQueue(qQueueChannel.queue, 'logs', '').then(function() {
            return qQueueChannel.queue;
          });
        });

        QueueChannel = QueueChannel.then(function(queue) {
          return channel.consume(queue, logMessage, {noAck: true});
        });

        return QueueChannel.then(function() {
          console.log(' [*] Waiting for logs. To exit press CTRL+C');
        });

        function logMessage(msg) {
          console.log(" [x] '%s'", msg.content.toString());
          connection.sendUTF(msg.content);
        }

      });
    }).catch(console.warn);
  });
}

module.exports = Producer
