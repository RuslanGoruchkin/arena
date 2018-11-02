require("babel-register")({
    presets: ["env"]
});
const dotenv = require("dotenv");
dotenv.config();
module.exports = require("./App.js");
