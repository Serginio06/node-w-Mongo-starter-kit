/**
 * Created by sergiiivanchenko on 22/02/2018.
 */
import {getLoggerForFile} from "../util/loggerUtil";
import {tokenRequiresMiddleware} from "../middleware/authenticateMiddleware";
import {applyIdentifierMiddleware} from "../middleware/requestMiddleware";
// import {apiTokenRequiresMiddleware} from "../middleware/authenticateApiMiddleware";
import fs from "fs";
import path from "path";


function _initRoutes(app, dir, isProtected) {
    const routes = fs.readdirSync(dir);
    const middleware = [applyIdentifierMiddleware];
    const logger = getLoggerForFile(__filename);

    if (isProtected) {
        middleware.push(tokenRequiresMiddleware);
    }

    for (const route of routes) {
        if (route.indexOf(".js") === -1) {
            continue;
        }

        logger.info(`Route ${route} found in ${dir}.`);

        const name = route.slice(0, route.indexOf(".js"));
        const routeFile = require(`${dir}/${name}`);

        for (const key in routeFile) {

            if (routeFile.hasOwnProperty(key)) {
                app.use(`/${key}`, middleware, routeFile[key]);

                logger.info(`Method /${key} of route "${name}" initialized.`);
            }
        }
    }
}

export function initRoutes(app) {
    const publicRoutes = path.join(__dirname, "./public");
    const protectedRoutes = path.join(__dirname, "./protected");

    _initRoutes(app, publicRoutes, false);
    _initRoutes(app, protectedRoutes, true);
}
