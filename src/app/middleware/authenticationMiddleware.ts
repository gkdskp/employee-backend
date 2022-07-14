import express from "express";
import UserNotAuthorizedException from "../exception/UserNotAuthorizedException";
import RequestWithUser from "../util/rest/request";
import jsonwebtoken from "jsonwebtoken";
import APP_CONSTANTS from "../constants";

/**
 * Middleware for authorising user and user role
 * @param permittedRoles roles permitted to access the route
 * @returns middleware function
 */
const authorize = (permittedRoles?: string[]) => {
    return async (
        req: RequestWithUser,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const token = getTokenFromRequestHeader(req);
            const data: any = jsonwebtoken.decode(token);
            const userRole: string = data['custom:role'];

            if(permittedRoles && !permittedRoles.includes(userRole)) {
                return next(new UserNotAuthorizedException());
            }
            
            jsonwebtoken.verify(token, process.env.JWT_TOKEN_SECRET);
            return next();
        } catch (error) {
            return next(new UserNotAuthorizedException());
        }
    };
};

const getTokenFromRequestHeader = (req: RequestWithUser) => {
    const tokenWithBearerHeader = req.header(
        `${APP_CONSTANTS.authorizationHeader}`
    );

    if (tokenWithBearerHeader) {
        return tokenWithBearerHeader.replace(`${APP_CONSTANTS.bearer} `, "");
    }
    return "";
};

export default authorize;