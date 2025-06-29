const amqp = require('amqplib');
let channel;
async function connect() {
  const url = process.env.AMQP_URL || 'amqp://localhost';
  const conn = await amqp.connect(url);
  channel = await conn.createChannel();
}
async function publish(queue, msg) {
  if (!channel) await connect();
  await channel.assertQueue(queue, { durable: false });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
}
module.exports = { publish };
