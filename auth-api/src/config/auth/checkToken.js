import jwt from "jsonwebtoken";
import { promisify } from "util";

import AuthException from "./AuthException.js";

import * as secrets from "../constants/secrets.js";
import * as httpsStatus from "../constants/httpStatus.js";

const emptySpace = " ";

export default async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            throw new AuthException(httpsStatus.UNAUTHORIZED, "Access token was not informed.");
        }
        let accessToken = authorization;
        if (accessToken.toLowerCase().includes(emptySpace)) {
            accessToken = accessToken.split(emptySpace)[1];
        }
        const decoded = await promisify(jwt.verify)(accessToken, secrets.API_SECRET);
        req.authUser = decoded.authUser;
        return next();
    } catch (err) {
        const status = err.status ? err.status : httpsStatus.INTERNAL_SERVER_ERROR
        return res.status(status).json({
            status, 
            message: err.message,
        });        
    }
};