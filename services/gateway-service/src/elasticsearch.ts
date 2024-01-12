import { winstonLogger } from "okieloki-jobber-lib";
import { Logger } from "winston";
import config from '@gateway/config'
import { Client } from "@elastic/elasticsearch";
import { ClusterHealthHealthResponseBody } from "@elastic/elasticsearch/lib/api/types";

const log: Logger = winstonLogger(
    config.ELASTIC_SEARCH_URL,
    "apiGatewayElasticConnection",
    "debug"
)

class ElasticSearch {

    private esClient = new Client({
        node: config.ELASTIC_SEARCH_URL
    })

    public async checkConnection(): Promise<void> {
        let isConnected = false;

        while (!isConnected) {
            try {
                const health: ClusterHealthHealthResponseBody = await this.esClient.cluster.health({})
                log.info(`ElasticSearch cluster health: ${health}`)
                isConnected = true
            } catch (error) {
                log.error(`Connection to Elastic Search Failed. Retrying....`)
                log.info("error", `GatewayService checkConnection error: ${error}`)
            }
        }
    }
}

const elastic: ElasticSearch = new ElasticSearch()

export default elastic



