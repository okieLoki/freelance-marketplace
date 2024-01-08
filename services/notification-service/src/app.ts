import { winstonLogger } from "okieloki-jobber-lib";
import { Logger } from "winston";
import { config } from "@notifications/config";
import express, { Express } from "express";
import { start } from "@notifications/server";

const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  "notificationApp",
  "debug",
);

const initialize = (): void => {
  const app: Express = express();
  start(app);
  log.info("Notification service initialized");
};

initialize();
