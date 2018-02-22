import {FACEBOOK_ID_NOT_UNIQUE, EMAIL_NOT_UNIQUE, EMAIL_NOT_VALID} from "../constants/serverErrorCode";
import {getLoggerForFile, stringify} from "../util/loggerUtil";
import {getSignupUserResultEntity} from "../converter/serverEntity";
import {getFacebookUser, getUser, getVerificationCode} from "../converter/dbModel";
import hashUtil from "../util/hashUtil";
import emailValidator from "email-validator";
import {ModelLocator} from "../models/ModelLocator";
import {VERIFY_USER_EMAIL} from "../constants/emailTarget";
import {sendEmail} from "../util/emailUtil";
import {getVerifyEmailData} from "../converter/letterData";
import {ServiceLocator} from "../util/ServiceLocator";

const logger = getLoggerForFile(__filename);

export class SignupController {
    checkUserEmail(email, reqIdentifier) {
        logger.info(`[${reqIdentifier}] [checkUserEmail] Attempt to check user email\nEmail: ${stringify(email)}`);

        const userModel = ModelLocator.getInstance().getUserModel();

        return userModel.findByEmail(email, reqIdentifier)
            .then((user) => {
                logger.info(`[${reqIdentifier}] [checkUserEmail] user with email ${email} fetched successfully\nUser: ${user}`);

                return Promise.resolve(user === null);
            })
            .catch((err) => {
                logger.error(`[${reqIdentifier}] [checkUserEmail] user email checking failed!\n${err}`);

                throw err;
            });
    }

    registerUser(firstName, familyName, email, password, verify, isOnDispatch, reqIdentifier) {
        logger.info(`[${reqIdentifier}] [registerUser] Attempt to register user
        \nFirstName: ${stringify(firstName)}
        \nFamilyName: ${stringify(familyName)}
        \nEmail: ${stringify(email)}
        \nPassword: ${stringify(password)}
        \nVerify: ${stringify(verify)}
        \nisOnDispatch: ${stringify(isOnDispatch)}`);

        if (!emailValidator.validate(email)) {
            throw new Error(EMAIL_NOT_VALID);
        }

        const userModel = ModelLocator.getInstance().getUserModel();
        const verificationCodeModel = ModelLocator.getInstance().getVerificationCodeModel();

        const credential = hashUtil.encryptPassword(password);

        let _user = getUser(firstName, familyName, email, credential, isOnDispatch, reqIdentifier);
        let _hash;
        let _verificationCode;

        return userModel.findByEmail(email, reqIdentifier)
            .then((user) => {
                logger.info(`[${reqIdentifier}] [registerUser] user with email ${email} fetched successfully
                \n${stringify(user)}`);

                if (user && user._id) {
                    logger.error(`[${reqIdentifier}] [registerUser] email ${email} not unique!`);
                    throw new Error(EMAIL_NOT_UNIQUE);
                }

                return userModel.newUser(_user, reqIdentifier);
            })
            .then((user) => {
                logger.info(`[${reqIdentifier}] [registerUser] user registered successfully
                \n${stringify(user)}`);

                _user = user;

                return this._getVerificationCodeHash(reqIdentifier);
            })
            .then((hash) => {
                logger.info(`[${reqIdentifier}] [registerUser] verification code hash generated successfully
                \n${stringify(hash)}`);

                _hash = hash;
                _verificationCode = getVerificationCode(_user._id, VERIFY_USER_EMAIL, _hash, reqIdentifier);

                return verificationCodeModel.newVerificationCode(_verificationCode, reqIdentifier);
            })
            .then((verificationCode) => {
                logger.info(`[${reqIdentifier}] [registerUser] verification code added successfully\n${stringify(verificationCode)}`);

                _verificationCode = verificationCode;

                const verifyEmailData = getVerifyEmailData(
                    _user._id,
                    _hash,
                    ServiceLocator.getInstance().getDomain(),
                    ServiceLocator.getInstance().getPort(),
                    reqIdentifier,
                );

                return sendEmail(_user.email, VERIFY_USER_EMAIL, verifyEmailData, reqIdentifier);
            })
            .then(() => Promise.resolve(getSignupUserResultEntity(_user, reqIdentifier)))
            .catch((err) => {
                logger.error(`[${reqIdentifier}] [registerUser] user registration failed!\n${err}`);

                if (_user._id || _verificationCode._id) {
                    return userModel.deleteById(_user._id, reqIdentifier)
                        .then(() => verificationCodeModel.deleteById(_verificationCode._id, reqIdentifier))
                        .then(() => {
                            throw err;
                        });
                }
                throw err;
            });
    }

    registerUserViaFacebook(name, facebookId, reqIdentifier) {
        logger.info(`[${reqIdentifier}] [registerUserViaFacebook] Attempt to register user via Facebook
        \nname: ${stringify(name)}
        \nfacebookId: ${stringify(facebookId)}`);

        const userModel = ModelLocator.getInstance().getUserModel();
        const _user = getFacebookUser(name, facebookId, reqIdentifier);

        return userModel.findByFacebookId(facebookId, reqIdentifier)
            .then((user) => {
                logger.info(`[${reqIdentifier}] [registerUserViaFacebook] user with facebookId ${facebookId} fetched successfully
                \n${user}`);

                if (user && user._id) {
                    logger.error(`[${reqIdentifier}] [registerUserViaFacebook] facebookId ${facebookId} not unique!`);
                    throw new Error(FACEBOOK_ID_NOT_UNIQUE);
                }

                return userModel.newUser(_user, reqIdentifier);
            })
            .then((user) => {
                logger.info(`[${reqIdentifier}] [registerUserViaFacebook] registered user fetched successfully
                \n${user}`);

                return Promise.resolve(getSignupUserResultEntity(user, reqIdentifier));
            })
            .catch((err) => {
                logger.error(`[${reqIdentifier}] [registerUserViaFacebook] user registration failed!
                \n${err}`);

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
