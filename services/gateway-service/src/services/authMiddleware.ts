import { NextFunction, Request, Response } from "express";
import { BadRequestError, IAuthPayload, NotAuthorizedError } from "okieloki-jobber-lib";
import jwt from "jsonwebtoken";
import { config } from "@gateway/config";

class AuthMiddleware {

    public verifyUser(req: Request, res: Response, next: NextFunction): void {

        if (!req.session?.jwt) {
            throw new NotAuthorizedError('Token is not available. Please login again', 'GatewayService verifyUser() method error')
        }

        try {
            const payload: IAuthPayload = jwt.verify(req.session?.jwt, config.JWT_TOKEN) as IAuthPayload;

            req.currentUser = payload;

        } catch (error) {
            throw new NotAuthorizedError('Token is not available. Please login again', 'GatewayService verifyUser() invalid session error')
        }
        next()
    }


    public checkAuthentication(req: Request, res: Response, next: NextFunction): void {
        if (!req.currentUser) {
            throw new BadRequestError('User is not authenticated', 'GatewayService checkAuthentication() method error')
        }
        next()
    }

}

const authMiddleware: AuthMiddleware = new AuthMiddleware();

export { authMiddleware }