// const config = require("../config/index");

const handler = function (req, res, next) {
    res.render("./signin.ejs");
};

module.exports = {
    signin: handler,
    signup: handler,
    recover: handler,
};
