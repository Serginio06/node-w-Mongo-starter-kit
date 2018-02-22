const md5 = require("md5");

const salt = "asf33467sf";

module.exports = {
    encryptPassword(password) {
        return md5(salt + password);
    },

    getRandomHash() {
        return md5(Math.pow(Math.random(), Math.random() * (100 - 1) + 1).toString());
    },

    getRandomHashByValue(value) {
        return md5(Math.pow(Math.random(), Math.random() * (100 - 1) + 1).toString() + value);
    },
};
