require("@babel/register")({
    cache: true
});
const dotenv = require("dotenv");
dotenv.config();
module.exports = require("./App.js");
