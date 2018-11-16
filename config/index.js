import { config } from "dotenv";

const _ = require("lodash");

// Load .env settings into process.env
// Will fail silently if no .env file present.
if (process.env.NODE_ENV !== "production") {
    config();
}
// Load our own defaults which will grab from process.env
const defaultConfig = require("./env/defaults");

// Only try this if we're not on Production
if (process.env.NODE_ENV !== "production") {
    // Load environment-specific settings
    let localConfig = {};

    try {
        // The environment file might not exist
        localConfig = require(`./env/${defaultConfig.env}`);
        localConfig = localConfig || {};
    } catch (err) {
        localConfig = {};
    }

    // merge the defaultConfig files
    // localConfig will override defaults
    _.merge({}, defaultConfig, localConfig);
}

module.exports = defaultConfig;
