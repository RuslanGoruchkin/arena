import fs from "fs";
import yaml from "js-yaml";
import _ from "lodash";
import { errorHandler } from "./";
const path = require("path");
let debug = require("debug")("bot:translate-helpers");

function replaceStrings(inputString, options) {
    try {
        if (options) {
            _.forEach(options, function(value, key) {
                inputString = inputString.split("${" + key + "}").join(value);
            });
        }
        return inputString;
    } catch (e) {
        errorHandler(e);
    }
}

export let t = (state, yml_path, options) => {
    try {
        let resultString = "";
        let lang = _.get(state, "player.language") || "en";
        let filename = path.resolve(__dirname, `../resources/locales/${lang}.yaml`);
        let doc = fs.readFileSync(filename, "utf8");
        let result = yaml.safeLoad(doc);
        let string = _.get(result, yml_path) || `❌ ${yml_path} - ${lang} ❌`;
        resultString = replaceStrings(string, options);
        if (!resultString) {
            // throw `Error: Unable to reach this string ${yml_path}`;
            return `${yml_path} need translation for ${lang}`;
        }
        return resultString;
    } catch (e) {
        errorHandler(e);
    }
};
