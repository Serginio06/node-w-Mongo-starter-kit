import {AUTH_ERROR, FACEBOOK_ID_NOT_FOUND, NOT_FOUND} from "../constants/serverErrorCode";
import {getSigninResultEntity} from "../converter/serverEntity";
import {getLoggerForFile, stringify} from "../util/loggerUtil";
import hashUtil from "../util/hashUtil";
import {ModelLocator} from "../models/ModelLocator";
import {getVerificationCode} from "../converter/dbModel";
import {RECOVER_PASSWORD} from "../constants/verificationCodeTargets";
import {getRecoverEmailData} from "../converter/letterData";
import {sendEmail} from "../util/emailUtil";
import {ServiceLocator} from "../util/ServiceLocator";
import {RECOVER_PASSWORD as RECOVER_PASS} from "../constants/emailTarget";

const logger = getLoggerForFile(__filename);

export class SigninController {
    login(email, password, reqIdentifier) {
        logger.info(`[${reqIdentifier}] [login] Attempt to login user
		    \nEmail: ${stringify(email)}
		    \nPassword: ${stringify(password)}`);

        const userModel = ModelLocator.getInstance().getUserModel();
        const companyModel = ModelLocator.getInstance().getCompanyModel();

        let _user = null;

        return userModel.findByEmailAndPassword(email, hashUtil.encryptPassword(password), reqIdentifier)
            .then((user) => {
                logger.info(`[${reqIdentifier}] [login] user fetched successfully
				    \n${user}`);

                if (!user) {
                    throw new Error(AUTH_ERROR);
                }

                _user = user;

                return companyModel.findByUserId(user._id, reqIdentifier);
            })
            .then((company) => {
                logger.info(`[${reqIdentifier}] [login] company fetched successfully
				    \n${company}`);

                return Promise.resolve(getSigninResultEntity(_user, company, reqIdentifier));
            })
            .catch((err) => {
                logger.error(`[${reqIdentifier}] [login] login failed!
				    \n${err}`);

                throw err;
            });
    }

    loginViaFacebook(facebookId, reqIdentifier) {
        logger.info(`[${reqIdentifier}] [loginViaFacebook] Attempt to login user
            \nfacebookId: ${stringify(facebookId)}`);

        const userModel = ModelLocator.getInstance().getUserModel();
        const companyModel = ModelLocator.getInstance().getCompanyModel();

        let _user = null;

        return userModel.findByFacebookId(facebookId, reqIdentifier)
            .then((user) => {
                logger.info(`[${reqIdentifier}] [loginViaFacebook] user fetched successfully
				    \n${user}`);

                if (!user) {
                    throw new Error(FACEBOOK_ID_NOT_FOUND);
                }

                _user = user;

                return companyModel.findByUserId(_user._id, reqIdentifier);
            })
            .then((company) => {
                logger.info(`[${reqIdentifier}] [loginViaFacebook] company fetched successfully
				    \n${company}`);

                return Promise.resolve(getSigninResultEntity(_user, company, reqIdentifier));
            })
            .catch((err) => {
                logger.error(`[${reqIdentifier}] [loginViaFacebook] login failed!
				    \n${err}`);

                throw err;
            });
    }

    recover(email, reqIdentifier) {
        logger.info(`[${reqIdentifier}] [recover] Attempt to recover password
            \nemail: ${stringify(email)}`);

        const userModel = ModelLocator.getInstance().getUserModel();
        const verificationCodeModel = ModelLocator.getInstance().getVerificationCodeModel();

        let _user = null;
        let _hash = null;
        let _verificationCode = null;

        return userModel.findByVerifiedEmail(email, reqIdentifier)
            .then((user) => {
                logger.info(`[${reqIdentifier}] [recover] user fetched successfully
                    \n${user}`);

                if (!user) {
                    throw new Error(NOT_FOUND);
                }

                _user = user;

                return this._getVerificationCodeHash(reqIdentifier);
            })
            .then((hash) => {
                logger.info(`[${reqIdentifier}] [recover] verification code hash generated successfully
                    \n${stringify(hash)}`);

                _hash = hash;

                _verificationCode = getVerificationCode(_user._id, RECOVER_PASS, _hash, reqIdentifier);

                return verificationCodeModel.newVerificationCode(_verificationCode, reqIdentifier);
            })
            .then((verificationCode) => {
                logger.info(`[${reqIdentifier}] [recover] verification code added successfully
                    \n${stringify(verificationCode)}`);

                _verificationCode = verificationCode;

                const recoverEmailData = getRecoverEmailData(
                    _user._id,
                    _hash,
                    ServiceLocator.getInstance().getDomain(),
                    ServiceLocator.getInstance().getPort(),
                    reqIdentifier,
                );

                return sendEmail(_user.email, RECOVER_PASSWORD, recoverEmailData, reqIdentifier);
            })
            .catch((err) => {
                logger.error(`[${reqIdentifier}] [recover] recover failed!\n${err}`);

                throw err;
            });
    }

    recoverUserPass(userId, hash, reqIdentifier) {
        logger.info(`[${reqIdentifier}] [recoverUserPass] Attempt to recover user password
            \nuserId: ${stringify(userId)}
            \nhash: ${stringify(hash)}`);

        const userModel = ModelLocator.getInstance().getUserModel();
        const verificationCodeModel = ModelLocator.getInstance().getVerificationCodeModel();

        let _user = null;

        return userModel.findById(userId, reqIdentifier)
            .then((user) => {
                logger.info(`[${reqIdentifier}] [recoverUserPass] user fetched successfully
                    \n${user}`);

                if (!user) {
                    throw new Error(`UserId wasn't found!\nuserId: ${stringify(userId)}`);
                }

                _user = user;

                return verificationCodeModel.findByHash(hash, reqIdentifier);
            })
            .then((verificationCode) => {
                logger.info(`[${reqIdentifier}] [recoverUserPass] verification code added successfully\n${stringify(verificationCode)}`);

                if (!verificationCode) {
                    throw new Error(NOT_FOUND);
                }
                if (verificationCode.target !== RECOVER_PASS) {
                    throw new Error(`Wrong verification code target! Code target: ${verificationCode.target}`);
                }
                if (verificationCode.userId !== userId) {
                    throw new Error(`Wrong verification code userId! Code userId: ${verificationCode.userId}`);
                }

                return verificationCodeModel.deleteById(verificationCode._id, reqIdentifier);
            })
            .catch((err) => {
                logger.error(`[${reqIdentifier}] [recover] recover failed!\n${err}`);

                throw err;
            });
    }

    _getVerificationCodeHash(reqIdentifier) {
        logger.info(`[${reqIdentifier}] [_getVerificationCodeHash] attempt to generate verification code hash`);

        const verificationCodeModel = ModelLocator.getInstance().getVerificationCodeModel();

        let count = 5;

        const getHash = () => {
            const hash = hashUtil.getRandomHash();

            return verificationCodeModel.findByHash(hash, reqIdentifier)
                .then((verificationCodes) => {
                    if (verificationCodes && verificationCodes.length) {
                        count--;
                    } else {
                        return Promise.resolve(hash);
                    }

                    if (count) {
                        return getHash();
                    }
                    throw new Error("Can't generate new hash for verification code!");
                });
        };

        return getHash();
    }
}
