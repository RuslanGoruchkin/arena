module.exports = {
    apps: [
        {
            name: "hackerpunk:bot",
            script: "App.js",
            exec_interpreter: "babel-node",
            // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
            autorestart: true,
            watch: true,
            max_memory_restart: "1G",
            env: {
                NODE_ENV: "development"
            },
            env_production: {
                NODE_ENV: "production"
            }
        }
    ]
};
