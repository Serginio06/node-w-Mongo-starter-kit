import {RECOVER_PASSWORD, VERIFY_USER_EMAIL} from "../constants/emailTarget";
import {getLoggerForFile, stringify} from "./loggerUtil";
import nodemailer from "nodemailer";
import ejs from "ejs";
import fsp from "fs-extra-promise";
import path from "path";

const logger = getLoggerForFile(__filename);

let _transport;

export function configureEmail(config) {
    _transport = nodemailer.createTransport(config);
}

export function sendEmail(receiver, type, data, reqIdentifier) {
    logger.info(`[${reqIdentifier}][] attempt to send email.
        \nreceiver: ${stringify(receiver)}
        \ntype: ${stringify(type)}
        \ndata: ${stringify(data)}`);

    let templatePath = "",
        subject = "";

    switch (type) {
    case VERIFY_USER_EMAIL:
        templatePath = path.join(__dirname, "../templates/EmailVerificationLetter.ejs");
        subject = "E-mail address verification";
        break;

    case RECOVER_PASSWORD:
        templatePath = path.join(__dirname, "../templates/RecoverPasswordLetter.ejs");
        subject = "Recover password";
        break;

    default:
        logger.error(`[${reqIdentifier}] [send] Unknown letter type! ${type}`);
        throw new Error("Unknown letter type!");
    }

    return _renderHtml(templatePath, data, reqIdentifier)
        .then(html => _send(receiver, subject, html));
}

function _send(receiver, subject, html, reqIdentifier) {
    logger.info(`[${reqIdentifier}][_send] attempt to send email
        \nreceiver: ${stringify(receiver)}
        \nsubject: ${stringify(subject)}`);

    const mailOptions = {
        from: "some.test.placeholder@gmail.com",
        to: receiver,
        subject,
        generateTextFromHTML: true,
        html,
    };

    return _transport.sendMail(mailOptions)
        .then(() => {
            logger.info(`[${reqIdentifier}][_send] email sent successfully`);

            return Promise.resolve();
        })
        .catch((err) => {
            logger.info(`[${reqIdentifier}][_send] email sending failed
                \n${err}`);

            return Promise.reject(err);
        })
        .then(() => {
            _transport.close();
        });
}

function _renderHtml(templatePath, templateData, reqIdentifier) {
    logger.info(`[${reqIdentifier}][_renderHtml] attempt to render html template
        \ntemplatePath: ${stringify(templatePath)}
        \ntemplateData: ${stringify(templateData)}`);

    return fsp.readFileAsync(templatePath, "utf-8")
        .then((data) => {
            logger.info(`[${reqIdentifier}][_renderHtml] template file was read successfully`);

            return ejs.render(data, templateData);
        });
}
