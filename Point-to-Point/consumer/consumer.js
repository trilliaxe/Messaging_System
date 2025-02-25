const amqp = require("amqplib"); 
const RABBITMQ_URL = "amqp://localhost"; 
const QUEUE = "order_queue"; 
 
async function consumeOrders() { 
    const connection = await amqp.connect(RABBITMQ_URL); 
    const channel = await connection.createChannel(); 
    await channel.assertQueue(QUEUE, { durable: true }); 
 
    console.log("Waiting for orders in", QUEUE); 
 
    channel.consume(QUEUE, (msg) => { 
        if (msg !== null) { 
            const order = JSON.parse(msg.content.toString()); 
            console.log("Received order:", order); 
            // Process order here (e.g., log, save to DB, etc.) 
            channel.ack(msg); 
        } 
        }); 
} 
consumeOrders();