let debug = require("debug")("bot:sequelize");
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const config = require("../config/config");
const basename = path.basename(__filename);
const db = {};
let sequelize;
sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    // process.env.RDS_HOSTNAME,
    {
        host: config.development.host,
        pool: {
            max: 5,
            min: 0,
            idle: 30000,
            acquire: 60000
        },
        // logging: false,
        logging: function(str) {
            debug(str);
        },
        dialect: config.development.dialect
    }
);
fs.readdirSync(__dirname)
    .filter(file => {
        return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
    })
    .forEach(file => {
        const model = sequelize["import"](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
