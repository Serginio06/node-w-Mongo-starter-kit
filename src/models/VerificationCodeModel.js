import mongoose from "mongoose";
import {AbstractModel} from "./AbstractModel";
import {getLoggerForFile, stringify} from "../util/loggerUtil";

const logger = getLoggerForFile(__filename);

export class VerificationCodeModel extends AbstractModel {
    constructor(dbInstance) {
        super(dbInstance);

        this._fields = "_id userId target hash";
        this._model = this._dbInstance.model("verificationCode", new mongoose.Schema({
            userId: {
                type: String,
                required: true,
            },
            target: {
                type: String,
                required: true,
            },
            hash: {
                type: String,
                required: true,
                unique: true,
            },
        }));
    }

    findByHash(hash, reqIdentifier) {
        logger.info(`[${reqIdentifier}] [findByHash] attempt to load verification code by hash
            \nhash: ${stringify(hash)}`);

        return this._model.findOne({hash}, this._fields);
    }

    deleteById(verificationCodeId, reqIdentifier) {
        logger.info(`[${reqIdentifier}] [deleteById] attempt to delete verification code by id
            \nverificationCodeId: ${stringify(verificationCodeId)}`);

        return this._model.deleteOne({_id: verificationCodeId});
    }

    newVerificationCode(verificationCode, reqIdentifier) {
        logger.info(`[${reqIdentifier}] [newVerificationCode] attempt to create new verification code
            \nverificationCode: ${stringify(verificationCode)}`);

        return this._model.create(verificationCode)
            .then(() => this.findByHash(verificationCode.hash));
    }
}
