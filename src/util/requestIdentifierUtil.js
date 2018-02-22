const md5 = require("md5");

const pool = [];

function getUniqueIdentifier() {
    let identifier,
        counter = 10;

    do {
        identifier = md5(Math.random().toString()).toString(16);

        if (pool.hasOwnProperty(identifier)) {
            counter--;
        }
    } while (pool.hasOwnProperty(identifier) && counter > 0);

    if (pool.hasOwnProperty(identifier)) {
        throw new Error("Can't create unique request id!");
    }

    pool[identifier] = {};

    return identifier;
}

function release(identifier) {
    if (pool.hasOwnProperty(identifier)) {
        delete pool[identifier];
    }
}

module.exports = {
    getUniqueIdentifier,
    release,
};
