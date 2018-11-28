/* eslint-disable destructuring/no-rename */
import _ from "lodash";

// let debug = require("debug")("bot:db-helpers");

export const difference = (object, base) =>
    _.transform(object, (result, value, key) => {
        if (!_.isEqual(value, base[key])) {
            result[key] = _.isObject(value) && _.isObject(base[key]) ? difference(value, base[key]) : value;
        }
    });
