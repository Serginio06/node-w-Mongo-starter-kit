import {AUTH_ERROR} from "../constants/serverErrorCode";
import {getLoggerForFile, stringify} from "../util/loggerUtil";
import hashUtil from "../util/hashUtil";
import {ModelLocator} from "../models/ModelLocator";

const logger = getLoggerForFile(__filename);

export class SettingsController {
    applyNewPassword(userId, newPassword, reqIdentifier) {
        logger.info(`[${reqIdentifier}] [applyNewPassword] Attempt to apply new password
		    \nuserId: ${stringify(userId)}
		    \nnewPassword: ${stringify(newPassword)}`);

        const userModel = ModelLocator.getInstance().getUserModel();

        return userModel.findById(userId, reqIdentifier)
            .then((user) => {
                logger.info(`[${reqIdentifier}] [applyNewPassword] user fetched successfully\n${user}`);

                if (!user) {
                    throw new Error(AUTH_ERROR);
                }

                const credential = hashUtil.encryptPassword(newPassword);

                return userModel.updatePassword(user._id, credential, reqIdentifier);
            })
            .then(() => {
                logger.info(`[${reqIdentifier}] [applyNewPassword] new password applied successfully`);

                return Promise.resolve();
            })
            .catch((err) => {
                logger.error(`[${reqIdentifier}] [applyNewPassword] applying new password failed!\n${err}`);

                throw err;
            });
    }
}
