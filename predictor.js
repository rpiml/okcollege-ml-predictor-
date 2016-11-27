#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var redis = require('redis');
var client = redis.createClient(); //creates a new client

client.on('connect', function() {
    console.log('connected');
});

amqp.connect('amqp://rabbitmq:rabbitmq@127.0.0.1', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'predictor_queue';

    ch.assertQueue(q, {durable: false});
    ch.prefetch(1);
    console.log(' [x] Awaiting RPC prediction requests');
    ch.consume(q, function reply(msg) {
      let content = msg.content.toString();

      console.log(" [.] Received Request");
      console.log("Payload:", msg);

      let response = bilinearModel(content);

      console.log("Recommending", response);

      ch.sendToQueue(msg.properties.replyTo,
        new Buffer(response.toString()),
        {correlationId: msg.properties.correlationId});

      ch.ack(msg);
    });
  });
});

function bilinearModel(n) {
  // TODO implement something resembling a bilinear model
  // client.get('college.csv', function(err, colleges) {
  //   client.get('student.csv', function(err, student) {
  //     // console.log(student);
  //     // console.log(colleges);
  //   });
  // });
  return "1501,299,279";
}
