import {getLoggerForFile} from "../../util/loggerUtil";
import {BAD_REQUEST} from "../../constants/serverErrorCode";
import {SettingsController} from "../../controllers/SettingsController";

const logger = getLoggerForFile(__filename);
const controller = new SettingsController();

module.exports = {
    applyNewPassword(req, res, next) {
        logger.info(`[${req.identifier}][onApplyNewPassword] attempt to apply new password`);

        if (!req.body || !req.body.newPassword) {
            logger.error(`[${req.identifier}] Request has a field with broken value`);
            res.json({
                success: false,
                errorCode: BAD_REQUEST,
            });

            next();
            return;
        }

        return controller.applyNewPassword(req.session.userId, req.sanitize(req.body.newPassword), req.identifier)
            .then(() => {
                res.json({
                    success: true,
                });
            })
            .catch((err) => {
                res.json({
                    success: false,
                    errorCode: err.message,
                });
            })
            .then(() => {
                next();
            });
    },
};
