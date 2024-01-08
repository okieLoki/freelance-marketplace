import express, { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const router: Router = express.Router();

const healthRoutes = (): Router => {
  router.get("/notification-health", (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({
      message: "Notification service is healthy",
    });
  });

  return router;
};

export { healthRoutes };
