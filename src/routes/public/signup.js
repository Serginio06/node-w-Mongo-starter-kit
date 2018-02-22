import {BAD_REQUEST} from "../../constants/serverErrorCode";
import {getLoggerForFile, stringify} from "../../util/loggerUtil";
import {SignupController} from "../../controllers/SignupController";

const logger = getLoggerForFile(__filename);
const controller = new SignupController();

module.exports = {
    registerUser(req, res, next) {
        logger.info(`[${req.identifier}][registerUser] Attempt to register new user.\nRequest body: ${stringify(req.body)}`);

        const firstName = req.sanitize(req.body.firstName);
        const familyName = req.sanitize(req.body.familyName);
        const email = req.sanitize(req.body.email);
        const password = req.sanitize(req.body.password);
        const verify = req.sanitize(req.body.verify);
        const isOnDispatch = req.sanitize(req.body.isOnDispatch);

        if (!firstName || !familyName || !email || !password || !verify) {
            logger.error(`[${req.identifier}] Request has a field with broken value`);
            res.json({
                success: false,
                errorCode: BAD_REQUEST,
            });

            next();
            return;
        }

        controller.registerUser(firstName, familyName, email, password, verify, isOnDispatch, req.identifier)
            .then((signupResult) => {
                res.cookie("userName", signupResult.userName);

                req.session.userId = signupResult.userId;

                res.json({
                    success: true,
                });
            })
            .catch((err) => {
                logger.info(`[${req.identifier}][registerUser] register new user failed!
                    \n${err}`);

                res.json({
                    success: false,
                    errorCode: err.message,
                });
            })
            .then(() => {
                next();
            });
    },

    registerUserViaFacebook(req, res, next) {
        logger.info(`[${req.identifier}][registerUserViaFacebook] Attempt to register new user via Facebook.\nRequest body: ${stringify(req.body)}`);

        const name = req.sanitize(req.body.name);
        const facebookId = req.sanitize(req.body.facebookId);

        if (!name || !facebookId) {
            logger.error(`[${req.identifier}] Request has a field with broken value`);
            res.json({
                success: false,
                errorCode: BAD_REQUEST,
            });

            next();
            return;
        }

        controller.registerUserViaFacebook(name, facebookId, req.identifier)
            .then((signupResult) => {
                res.cookie("userName", signupResult.userName);

                req.session.userId = signupResult.userId;

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

    checkEmail(req, res, next) {
        logger.info(`[${req.identifier}][checkEmail] Attempt to check user email.\nRequest body: ${stringify(req.body)}`);

        const email = req.sanitize(req.body.email);

        if (!email) {
            logger.error(`[${req.identifier}] Request has no email`);
            res.json({
                success: false,
                errorCode: BAD_REQUEST,
            });

            next();
            return;
        }

        controller.checkUserEmail(email, req.identifier)
            .then((checkingResult) => {
                res.json({
                    success: true,
                    payload: checkingResult,
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
