import { Channel, ConsumeMessage } from "amqplib";
import { winstonLogger } from "okieloki-jobber-lib";
import { config } from "@notifications/config";
import { Logger } from "winston";
import { createConnection } from "@notifications/queues/connection";

const log: Logger = winstonLogger(
    `${config.ELASTIC_SEARCH_URL}`,
    "emailConsumer",
    "debug",
)

const consumeAuthEmailMessages = async (channel: Channel): Promise<void> => {
    try {
        if (!channel) {
            channel = await createConnection();
        }

        const exhangeName: string = 'jobber-email-queue'
        const routingKey: string = 'auth-email'
        const queueName: string = 'auth-email-queue'

        await channel.assertExchange(exhangeName, 'direct')

        const queue = await channel.assertQueue(queueName, {
            durable: true,
            autoDelete: false,
        })

        await channel.bindQueue(queue.queue, exhangeName, routingKey)

        channel.consume(queue.queue, async (msg: ConsumeMessage | null) => {
            console.log(msg?.content.toString())
        })

    } catch (error) {
        log.log("error", "NotificationService consumeAuthEmailMessages() method:", error);
    }
}