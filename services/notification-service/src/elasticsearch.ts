import { Client } from "@elastic/elasticsearch";
import { ClusterHealthHealthResponseBody } from "@elastic/elasticsearch/lib/api/types";
import { config } from "@notifications/config";
import { winstonLogger } from "okieloki-jobber-lib";
import { Logger } from "winston";

const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  "notificationElasticSearch",
  "debug",
);

const elasticSearchClient = new Client({
  node: "http://localhost:9200",
});

const checkConnection = async (): Promise<void> => {
  let isConnected = false;

  while (!isConnected) {
    try {
      const health: ClusterHealthHealthResponseBody =
        await elasticSearchClient.cluster.health({});
      log.info(`Notification ElasticSearch cluster health: ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error("Connection to ElasticSearch failed. Retrying....");
      log.log("error", "NotificationService checkConnection() method:", error);
    }
  }
};

export { checkConnection };
