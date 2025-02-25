const amqp = require("amqplib"); 
const EXCHANGE = "announcements_exchange"; 
const RABBITMQ_URL = "amqp://localhost"; 

async function subscribeToAnnouncements() { 
    const connection = await amqp.connect(RABBITMQ_URL); 
    const channel = await connection.createChannel(); 
    await channel.assertExchange(EXCHANGE, "fanout", { durable: true }); 

    // Create a queue with a random name for this subscriber 
    const { queue } = await channel.assertQueue("", { exclusive: true }); 

    // Bind this queue to the 'announcements_exchange' 
    await channel.bindQueue(queue, EXCHANGE, ""); 
    console.log("Waiting for announcements in queue:", queue); 
    channel.consume(queue, (msg) => { 
        if (msg !== null) { 
            const announcement = JSON.parse(msg.content.toString()); 
            console.log("Received announcement:", announcement); 
            channel.ack(msg); 
        } 
    }); 
} 
subscribeToAnnouncements();