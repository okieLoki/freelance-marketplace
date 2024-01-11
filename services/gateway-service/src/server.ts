import { Application, Request, Response, NextFunction, json } from "express";
import { IErrorResponse, winstonLogger, CustomError } from "okieloki-jobber-lib";
import { Logger } from "winston";
import cookieSession from "cookie-session";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { StatusCodes } from "http-status-codes";


const SERVER_PORT = 8000;
const log: Logger = winstonLogger("", "apiGatewayServer", "debug");

class gatewayServer {
    private app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public start(): void {
        this.securityMiddleware(this.app);
        this.standardMiddleware(this.app);
        this.routesMiddleware(this.app);
        this.startElasticSearch();
        this.errorHandler(this.app);
    }

    private securityMiddleware(app: Application): void {
        app.set("trust proxy", true);
        app.use(
            cookieSession({
                name: "session",
                keys: [],
                maxAge: 24 * 7 * 60 * 60 * 1000, // 7 days
                secure: false,
                // sameSite: 'none',
            }),
        );
        app.use(hpp());
        app.use(helmet());
        app.use(
            cors({
                origin: true,
                credentials: true,
                methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            }),
        );
    }

    private standardMiddleware(app: Application): void {
        app.use(compression());
        app.use(
            json({
                limit: "200mb",
            }),
        );
    }

    private routesMiddleware(app: Application): void { }

    private startElasticSearch(): void { }

    private errorHandler(app: Application): void {
        app.use("*", (req: Request, res: Response, next: NextFunction) => {
            const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

            log.log("error", `Route not found: ${fullUrl}`);

            res.status(StatusCodes.NOT_FOUND).json({
                message: `Route not found: ${fullUrl}`,
            });
            next()
        });

        app.use(
            (err: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
                log.log("error", `GatewayService Error: ${err.message}`);
                if (err instanceof CustomError) {
                    return res.status(err.statusCode).json({ errors: err.serializeErrors() });
                }
                next()
            }
        )
    }
}

export default gatewayServer;
