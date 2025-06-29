const amqp = require('amqplib');
let channel;
const QUEUE = 'reports';

async function connect() {
  const url = process.env.AMQP_URL || 'amqp://localhost';
  const conn = await amqp.connect(url);
  channel = await conn.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });
}

async function publish(msg) {
  if (!channel) await connect();
  channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(msg)), {
    persistent: true
  });
}

module.exports = { connect, publish };
