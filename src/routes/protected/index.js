

const handler = function (req, res, next) {
    res.render("./main.ejs");
};

module.exports = {
    "/": handler,
    welcome: handler,
    password: handler,
};
