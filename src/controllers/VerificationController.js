import {ModelLocator} from "../models/ModelLocator";
import {getLoggerForFile, stringify} from "../util/loggerUtil";
import {NOT_FOUND} from "../constants/serverErrorCode";

const logger = getLoggerForFile(__filename);

export class VerificationController {
    verifyUserMail(userId, hash, reqIdentifier) {
        logger.info(`[${reqIdentifier}][verifyUserMail] attempt to verify user email address
            \nuserId: ${stringify(userId)}
            \nhash: ${stringify(hash)}`);

        const verificationCodeModel = ModelLocator.getInstance().getVerificationCodeModel();
        const userModel = ModelLocator.getInstance().getUserModel();

        return verificationCodeModel.findByHash(hash, reqIdentifier)
            .then((verificationCode) => {
                logger.info(`[${reqIdentifier}][verifyUserMail] verification code fetched successfully
                \nverificationCode: ${stringify(verificationCode)}`);

                if (!verificationCode || verificationCode.userId !== userId) {
                    throw new Error(NOT_FOUND);
                }

                return verificationCodeModel.deleteById(verificationCode._id, reqIdentifier);
            })
            .then(() => {
                logger.info(`[${reqIdentifier}][verifyUserMail] verification code deleted successfully`);

                return userModel.verify(userId, reqIdentifier);
            });
    }
}
