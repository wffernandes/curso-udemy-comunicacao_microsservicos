import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserRepository from "../repository/UserRepository.js";
import * as httpsStatus from "../../../config/constants/httpStatus.js";
import UserException from "../exception/UserException.js";
import * as secrets from "../../../config/constants/secrets.js"

class UserService {
    async findByEmail(req) {
        try {
            const { email } = req.params;
            const { authUser } = req;
            this.validateRequestData(email);
            let user = await UserRepository.findByEmail(email);
            this.validateUserNotFound(user);
            this.validateAuthenticateUser(user, authUser)
            return {
                status: httpsStatus.SUCCESS,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            };
        } catch (err) {
            return {
                status: err.status ? err.status : httpsStatus.INTERNAL_SERVER_ERROR,
                message: err.message,
            };
        }
    }

    validateRequestData(email) {
        if (!email) {
            throw new UserException(
                httpsStatus.BAD_REQUEST,
                "User email was not informed."
            );
        }
    }

    validateUserNotFound(user) {
        if (!user) {
            throw new UserException(httpsStatus.BAD_REQUEST, "User was not found.")
        }
    }

    validateAuthenticateUser(user, authUser) {
        if (!authUser || user.id !== authUser.id) {
            throw new UserException(httpsStatus.FORBIDDEN, "You cannot see this user data.");
        }
    }

    async getAccessToken(req) {
        try {
            const {email, password } = req.body;
            this.validateAccessTokenData(email, password);
            let user = await UserRepository.findByEmail(email);
            await this.validatePassword(password, user.password);
            this.validateUserNotFound(user);
            const authUser = { id: user.id, name: user.name, email: user.email}
            const accessToken = jwt.sign({ authUser }, secrets.API_SECRET, { expiresIn: "1d", });
            return {
                status: httpsStatus.SUCCESS,
                accessToken,
            }
        } catch (err) {
            return {
                status: err.status ? err.status : httpsStatus.INTERNAL_SERVER_ERROR,
                message: err.message,
            };
        }

    }

    validateAccessTokenData(email, password) {
        if (!email || !password) {
            throw new UserException(httpsStatus.UNAUTHORIZED, "Email and password must be informed.")
        }
    }

    async validatePassword(password, hashPassWord) {
        if (!await bcrypt.compare(password, hashPassWord)) {
            throw new UserException(httpsStatus.UNAUTHORIZED, "Password doesn't match.")
        }
    }
}

export default new UserService();