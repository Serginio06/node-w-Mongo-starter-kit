import mongoose from "mongoose";
import {AbstractModel} from "./AbstractModel";
import {getLoggerForFile, stringify} from "../util/loggerUtil";

const logger = getLoggerForFile(__filename);

export class UserModel extends AbstractModel {
    constructor(dbInstance) {
        super(dbInstance);

        this._fields = "_id name facebookId email verified password isOnDispatch";
        this._model = this._dbInstance.model("user", new mongoose.Schema({
            name: {
                type: String,
                required: true,
            },
            facebookId: {
                type: Number,
                required: false,
            },
            email: {
                type: String,
                required: false,
            },
            verified: {
                type: Boolean,
                required: true,
            },
            password: {
                type: String,
                required: false,
            },
            isOnDispatch: {
                type: Boolean,
                required: false,
            },
        }));
    }

    findById(userId, reqIdentifier) {
        logger.info(`[${reqIdentifier}] [findById] attempt to load user by id
            \nuserId: ${stringify(userId)}`);

        return this._model.findOne({_id: userId}, this._fields);
    }

    findByEmail(email, reqIdentifier) {
        logger.info(`[${reqIdentifier}] [findByEmail] attempt to load user by email
            \nemail: ${stringify(email)}`);

        return this._model.findOne({email}, this._fields);
    }

    findByVerifiedEmail(email, reqIdentifier) {
        logger.info(`[${reqIdentifier}] [findByVerifiedEmail] attempt to load user by verified email
            \nemail: ${stringify(email)}`);

        return this._model.findOne({email, verified: true}, this._fields);
    }

    findByFacebookId(facebookId, reqIdentifier) {
        logger.info(`[${reqIdentifier}] [findByFacebookId] attempt to load user by facebookId
            \nfacebookId: ${stringify(facebookId)}`);

        return this._model.findOne({facebookId}, this._fields);
    }

    findByEmailAndPassword(email, password, reqIdentifier) {
        logger.info(`[${reqIdentifier}] [findByEmailAndPassword] attempt to load user by email and password
            \nemail: ${stringify(email)}
            \npassword: ${stringify(password)}`);

        return this._model.findOne({email, password}, this._fields);
    }

    deleteById(userId, reqIdentifier) {
        logger.info(`[${reqIdentifier}] [deleteById] attempt to delete user by id
            \nuserId: ${stringify(userId)}`);

        return this._model.deleteOne({_id: userId});
    }

    newUser(user, reqIdentifier) {
        logger.info(`[${reqIdentifier}] [newUser] attempt to create new user
            \nuser: ${stringify(user)}`);

        return this._model.create(user)
            .then(() => {
                if (user.email) {
                    return this.findByEmail(user.email);
                }
                return this.findByFacebookId(user.facebookId);
            });
    }

    verify(userId, reqIdentifier) {
        logger.info(`[${reqIdentifier}] [verify] attempt to verify user by id
            \nuserId: ${stringify(userId)}`);

        return this._model.update({_id: userId}, {$set: {verified: true}});
    }

    updatePassword(userId, password, reqIdentifier) {
        logger.info(`[${reqIdentifier}] [updatePassword] attempt to update user's password by id
            \nuserId: ${stringify(userId)}
            \npassword: ${stringify(password)}`);

        return this._model.update({_id: userId}, {$set: {password}});
    }
}
