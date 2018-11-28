require("dotenv").config({ debug: process.env.DEBUG });
module.exports = {
    development: {
        database: process.env.RDS_DB,
        username: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        host: process.env.RDS_HOSTNAME,
        port: process.env.RDS_PORT,
        migrationStorage: "json",
        seederStorage: "json",
        dialect: "mysql",
        define: {
            underscored: true
        }
    }
};
