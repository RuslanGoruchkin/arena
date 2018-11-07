import consoleToSlack from "console-to-slack";

export let initLoggers = function() {
    const debug = require("debug")("bot:app");
    const Sentry = require("@sentry/node");
    if (process.env.SENTRY_ID) {
        Sentry.init({ dsn: process.env.SENTRY_ID });
    }
    if (process.env.SLACK_URL) {
        consoleToSlack.init(process.env.SLACK_URL, 4);
    }
    return { Sentry, debug };
};
