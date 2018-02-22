import {getLoggerForFile} from "../util/loggerUtil";

const requestUtil = require("../util/requestIdentifierUtil");
const logger = getLoggerForFile(__filename);

export function applyIdentifierMiddleware(req, res, next) {
    req.identifier = requestUtil.getUniqueIdentifier();

    logger.info(`[applyIdentifierMiddleware] Identifier ${req.identifier} applied`);

    next();
}

export function releaseIdentifierMiddleware(req, res, next) {
    if (req.identifier) {
        requestUtil.release(req.identifier);
        logger.info(`[releaseIdentifierMiddleware] Identifier ${req.identifier} released`);
    }
}
