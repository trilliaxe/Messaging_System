const amqp = require("amqplib"); 
const RABBITMQ_URL = "amqp://localhost"; 
const QUEUE = "order_queue"; 
async function sendOrder(order) { 

    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel(); 
    await channel.assertQueue(QUEUE, { durable: true }); 

    const messageBuffer = Buffer.from(JSON.stringify(order)); 
    channel.sendToQueue(QUEUE, messageBuffer); 

    console.log("Sent order:", order); 
    await channel.close(); 
    await connection.close(); 
} 

// Example usage: 
sendOrder({ orderId: 101, customerName: "Alice", items: ["Widget", "Gadget"] }); 