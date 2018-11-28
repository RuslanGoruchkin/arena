import consoleToSlack from "console-to-slack";
const Sentry = require("@sentry/node");
let debug = require("debug")("bot:loggers");
import { redirectToOopsScene } from "./";
export let initLoggers = function() {
    if (process.env.SENTRY_ID) {
        Sentry.init({ dsn: process.env.SENTRY_ID });
    }
    if (process.env.SLACK_URL) {
        consoleToSlack.init(process.env.SLACK_URL, 4, {});
    }
    return { Sentry, debug };
};
export let errorHandler = (error, ctx, state) => {
    debug(error);
    console.error(error);
    Sentry.captureException(error);
    if (ctx && state) {
        return redirectToOopsScene(ctx, state, error);
    }
};
