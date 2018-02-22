import {getLoggerForFile} from "../../util/loggerUtil";
import {VerificationController} from "../../controllers/VerificationController";

const logger = getLoggerForFile(__filename);
const controller = new VerificationController();

module.exports = {
    "verify/:userId/:hash": function (req, res, next) {
        logger.info(`[${req.identifier}][verify] attempt to verify user email`);

        const userId = req.params.userId;
        const hash = req.params.hash;

        return controller.verifyUserMail(userId, hash, req.identifier)
            .then(() => {
                logger.info(`[${req.identifier}][verify] user email verified successfully`);

                res.cookie("verifyMessage", "Verification successful :)");
                res.render("../views/verify.ejs");
            })
            .catch((err) => {
                logger.error(`[${req.identifier}][verify] can't verify user email!
                    \n${err}`);

                res.cookie("verifyMessage", "Something went wrong :(");
                res.render("../views/verify.ejs");
            })
            .then(() => {
                next();
            });
    },
};
