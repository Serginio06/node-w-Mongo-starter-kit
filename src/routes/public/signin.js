import {BAD_REQUEST} from "../../constants/serverErrorCode";
import {getLoggerForFile, stringify} from "../../util/loggerUtil";
import {getSigninPayload} from "../../converter/serverEntity";
import {SigninController} from "../../controllers/SigninController";

const logger = getLoggerForFile(__filename);
const controller = new SigninController();

module.exports = {
    login(req, res, next) {
        logger.info(`[${req.identifier}][login] Attempt to login.\nRequest body: ${stringify(req.body)}`);

        const email = req.sanitize(req.body.email);
        const password = req.sanitize(req.body.password);
        const keepLogged = req.sanitize(req.body.keepLogged);

        if (!email || !password) {
            logger.error(`[${req.identifier}] Request has a field with broken value`);
            res.json({
                success: false,
                errorCode: BAD_REQUEST,
            });

            next();
            return;
        }

        controller.login(email, password, req.identifier)
            .then((signinResult) => {
                req.session.userId = signinResult.userId;

                if (!keepLogged) {
                    req.session.cookie.expires = null;
                }

                res.json({
                    success: true,
                    payload: getSigninPayload(signinResult),
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

    loginViaFacebook(req, res, next) {
        logger.info(`[${req.identifier}][loginViaFacebook] Attempt to login via Facebook.\nRequest body: ${stringify(req.body)}`);

        const facebookId = req.sanitize(req.body.facebookId);
        const keepLogged = req.sanitize(req.body.keepLogged);

        if (!facebookId) {
            logger.error(`[${req.identifier}] Request has a field with broken value`);
            res.json({
                success: false,
                errorCode: BAD_REQUEST,
            });

            next();
            return;
        }

        controller.loginViaFacebook(facebookId, req.identifier)
            .then((signinResult) => {
                req.session.userId = signinResult.userId;

                if (!keepLogged) {
                    req.session.cookie.expires = null;
                }

                res.json({
                    success: true,
                    payload: getSigninPayload(signinResult),
                });
            })
            .catch((err) => {
                console.error(err);
                res.json({
                    success: false,
                    errorCode: err.message,
                });
            })
            .then(() => {
                next();
            });
    },

    recoverPass(req, res, next) {
        logger.info(`[${req.identifier}][recoverPass] Attempt to recover password.
            \nRequest body: ${stringify(req.body)}`);

        if (!req.body || !req.body.email) {
            logger.error(`[${req.identifier}] Request has a field with broken value`);
            res.json({
                success: false,
                errorCode: BAD_REQUEST,
            });

            next();
            return;
        }

        const email = req.sanitize(req.body.email);

        return controller.recover(email, req.identifier)
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
            });
    },

    "recover/:userId/:hash": function (req, res, next) {
        logger.info(`[${req.identifier}][recover] attempt to recover user pass`);

        const userId = req.params.userId;
        const hash = req.params.hash;

        return controller.recoverUserPass(userId, hash, req.identifier)
            .then(() => {
                logger.info(`[${req.identifier}][recover] user pass recovered successfully`);

                req.session.userId = userId;

                res.redirect(301, "/password");
            })
            .then(() => {
                next();
            });
    },

    logout(req, res, next) {
        logger.info(`[${req.identifier}][logout] Attempt to logout.`);

        try {
            req.session.destroy(() => {
            });

            res.json({
                success: true,
            });
        } catch (err) {
            res.json({
                success: false,
                errorCode: err.message,
            });
        } finally {
            next();
        }
    },
};
