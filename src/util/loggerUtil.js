// import {isNull, isUndefined} from "util";

const log4js = require("log4js");

let _root = "";
let _rootLength = 0;

export function configureLogger(config) {
    log4js.configure(config);
}

export function setRoot(value) {
    _root = value;
    _rootLength = _root.length;
}

export function getLoggerForFile(filepath) {
    const index = filepath.lastIndexOf(".");

    if (index > -1) {
        filepath = filepath.substr(0, index);
    }
    if (_rootLength) {
        filepath = filepath.substr(_rootLength);
    }
    if (filepath.length > 32) {
        filepath = filepath.substr(-32);
    }

    return log4js.getLogger(filepath);
}

export function stringifyArray(obj) {
    let arr = [];

    try {
        arr = JSON.parse(JSON.stringify(obj));

        for (let item of arr) {
            item = _stringifyObj(item);
        }
    } catch (err) {
        // do nothing
    }

    return stringify(arr);
}

export function stringifyObj(obj) {
    if (!obj) {
        return "";
    }

    let _obj = JSON.parse(JSON.stringify(obj));

    _obj = _stringifyObj(_obj);

    return stringify(_obj);
}

export function _stringifyObj(obj) {
    for (const key in obj) {
        if (typeof obj[key] === "string") {
            obj[key] = _stringifyStr(obj, key);
        } else if (typeof obj[key] === "object" && obj[key] && obj[key].length) {
            if (typeof obj[key][0] === "string") {
                obj[key] = _stringifyArrayStr(obj[key]);
            }
        }
    }

    return obj;
}

function _stringifyArrayStr(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] && arr[i].length && arr[i].length > 100) {
            arr[i] = "Too long value";
        }
    }

    return arr;
}

function _stringifyStr(obj, key) {
    if (obj[key] && obj[key].length && obj[key].length > 1000) {
        obj[key] = "Too long value";
    }
}

export function stringify(obj) {
    return JSON.stringify(obj, null, "\t");
}
