/* eslint-disable lodash/chaining,lodash/chain-style */
let _ = require("lodash");
_.mixin({
    compactObject: function(input) {
        if (!_.isObject(input)) {
            return input;
        } else {
            return _.chain(input)
                .keys()
                .filter(key => input[key])
                .map(key => ({
                    [key]: _.isObject(input[key]) ? _.compactObject(input[key]) : input[key]
                }))
                .reduce(_.extend)
                .value();
        }
    }
});
module.exports = _;
