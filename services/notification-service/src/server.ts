import "express-async-errors";
import { winstonLogger } from "okieloki-jobber-lib";
import { Logger } from "winston";
import { config } from "@notifications/config";
import { Application } from "express";
import http from "http";
import { healthRoutes } from "@notifications/routes";
import { checkConnection } from "@notifications/elasticsearch";
import { createConnection } from "@notifications/queues/connection";
import { Channel } from "amqplib";
import {
  consumeAuthEmailMessages,
  consumeOrderEmail,
} from "./queues/email.consumer";

const SERVER_PORT = 8001;
const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  "notificationServer",
  "debug",
);

const start = (app: Application): void => {
  startServer(app);
  app.use("/", healthRoutes);
  startQueues();
  startElasticSearch();
};

const startQueues = async (): Promise<void> => {
  const emailChannel: Channel = await createConnection();

  await emailChannel.assertExchange("jobber-email-queue", "direct");

  const dataToSendToQueueForTest = {
    recieverEmail: `${config.SENDER_EMAIL}`,
    username: "uddeepta",
    verifyLink: "https://www.google.com",
    resetLink: "https://www.google.com",
    template: "verifyEmail",
  };

  await emailChannel.publish(
    "jobber-email-queue",
    "auth-email",
    Buffer.from(JSON.stringify(dataToSendToQueueForTest)),
  );

  await consumeAuthEmailMessages(emailChannel);
};

const startElasticSearch = (): void => {
  checkConnection();
};

const startServer = (app: Application): void => {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Worker with process id of ${process.pid} started`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server started on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.error("NotificationService startServer() method:", error);
  }
};

export { start };
