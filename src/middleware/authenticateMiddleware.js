import {AUTH_ERROR} from "../constants/serverErrorCode";

export function tokenRequiresMiddleware(req, res, next) {
    if (!req.session || !req.session.id || !req.session.userId) {
        req.session.destroy(() => {
        });


        if (req.method === "GET") {
            res.redirect("/signin");
        } else {
            res.json({
                success: false,
                errorCode: AUTH_ERROR,
            });
        }

        return;
    }

    next();
}

export function tokenAbsentMiddleware(req, res, next) {
    if (req.session && req.session.id && req.session.userId) {
        if (req.method === "GET" && req.originalUrl.indexOf("/signin") !== -1) {
            res.redirect("/");
        } else {
            res.json({
                success: false,
                errorCode: AUTH_ERROR,
            });
        }

        return;
    }

    next();
}
