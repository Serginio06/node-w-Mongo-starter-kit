import {UserModel} from "./UserModel";
import {VerificationCodeModel} from "./VerificationCodeModel";

export class ModelLocator {
    instance;

    _dbInstance;

    _userModel;
    _verificationCodeModel;


    constructor(dbInstance) {
        this._dbInstance = dbInstance;

        this._userModel = null;
        this._verificationCodeModel = null;

    }

    static getInstance(dbInstance) {
        if (!this.instance) {
            this.instance = new ModelLocator(dbInstance);
        }
        return this.instance;
    }

    getUserModel() {
        if (this._userModel === null) {
            this._userModel = new UserModel(this._dbInstance);
        }

        return this._userModel;
    }

    getVerificationCodeModel() {
        if (this._verificationCodeModel === null) {
            this._verificationCodeModel = new VerificationCodeModel(this._dbInstance);
        }

        return this._verificationCodeModel;
    }
}