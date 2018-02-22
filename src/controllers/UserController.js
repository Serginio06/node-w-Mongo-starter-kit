import {getLoggerForFile, stringify} from "../util/loggerUtil";
import {ModelLocator} from "../models/ModelLocator";
import {AUTH_ERROR} from "../constants/serverErrorCode";
import {getUserInfo} from "../converter/serverEntity";

const logger = getLoggerForFile(__filename);

export class UserController {
    loadUserInfo(userId, reqIdentifier) {
        logger.info(`[${reqIdentifier}] [loadUserInfo] attempt to load info about user
            \nuserId: ${userId}`);

        const userModel = ModelLocator.getInstance().getUserModel();

        return userModel.findById(userId, reqIdentifier)
            .then((user) => {
                logger.info(`[${reqIdentifier}] [loadUserInfo] user fetched successfully
                    \nuser: ${stringify(user)}`);

                if (!user) {
                    throw new Error(AUTH_ERROR);
                }

                return Promise.resolve(getUserInfo(user, reqIdentifier));
            })
            .catch((err) => {
                logger.error(`[${reqIdentifier}] [loadUserInfo] user info loading failed!\n${err}`);

                throw err;
            });
    }
}
