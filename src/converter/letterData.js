import {getLoggerForFile, stringify} from "../util/loggerUtil";

const logger = getLoggerForFile(__filename);

export function getVerifyEmailData(userId, hash, domain, port, reqIdentifier) {
    logger.info(`[${reqIdentifier}][getVerifyEmailData] attempt to create data for verification email template
        \nuserId: ${stringify(userId)}
        \nhash: ${stringify(hash)}`);

    return {
        link: `${domain}:${port}/verify/${userId}/${hash}`,
    };
}

export function getRecoverEmailData(userId, hash, domain, port, reqIdentifier) {
    logger.info(`[${reqIdentifier}][getRecoverEmailData] attempt to create data for recover email template
        \nuserId: ${stringify(userId)}
        \nhash: ${stringify(hash)}`);

    return {
        link: `${domain}:${port}/recover/${userId}/${hash}`,
    };
}
