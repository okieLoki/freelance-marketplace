import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { winstonLogger } from "okieloki-jobber-lib";
import { config } from "@gateway/config";
import { Logger } from "winston";

const log: Logger = winstonLogger(
    config.ELASTIC_SEARCH_URL,
    "apiGatewayHeathRoute",
    "debug",
);

class Health {
    public healthController(req: Request, res: Response): void {
        log.info(`GatewayService healthController called`);
        res.status(StatusCodes.OK).json({
            message: "Gateway Service is healthy and OK",
        });
    }
}

export { Health }