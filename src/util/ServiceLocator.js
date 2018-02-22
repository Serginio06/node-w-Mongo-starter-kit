import hashUtil from "./hashUtil";

export class ServiceLocator {
    instance;

    _domain;
    _port;
    _serverId;

    static getInstance() {
        if (!this.instance) {
            this.instance = new ServiceLocator();
        }

        return this.instance;
    }

    getServerId() {
        if (!this._serverId) {
            this._serverId = hashUtil.getRandomHash();
        }

        return this._serverId;
    }

    setDomain(domain) {
        this._domain = domain;
        return this;
    }

    getDomain() {
        return this._domain;
    }

    setPort(port) {
        this._port = port;
        return this;
    }

    getPort() {
        return this._port;
    }
}