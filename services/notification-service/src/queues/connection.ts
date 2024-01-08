import client, { Channel, Connection } from "amqplib";
import { winstonLogger } from "okieloki-jobber-lib";
import { config } from "@notifications/config";
import { Logger } from "winston";

const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  "notificationQueueConnection",
  "debug",
);

const createConnection = async (): Promise<Channel | undefined> => {
  try {
    const connection: Connection = await client.connect(
      `${config.RABBITMQ_ENDPOINT}`,
    );

    const channel: Channel = await connection.createChannel();

    log.info("Notification queue connection connected to queue successfully");

    closeConnection(channel, connection);

    return channel;
  } catch (error) {
    log.log("error", "NotificationService createConnection() method:", error);
    return undefined;
  }
};

const closeConnection = (channel: Channel, connection: Connection): void => {
  process.once("SIGINT", async () => {
    await channel.close();
    await connection.close();
  });
};

export { createConnection };
