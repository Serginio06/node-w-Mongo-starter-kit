export class AbstractModel {
    _fields;
    _dbInstance;
    _model;

    constructor(dbInstance) {
        this._dbInstance = dbInstance;
    }
}