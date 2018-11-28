require("@babel-register")({
    presets: ["env"]
});
const dotenv = require("dotenv");
dotenv.config();
module.exports = require("./tests/utilTests.js");
module.exports = require("./tests/ctxTests.js");
