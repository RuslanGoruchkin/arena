"use strict";

var Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable "players", deps: []
 * createTable "properties", deps: []
 * createTable "userHistories", deps: []
 * createTable "sessions", deps: [players]
 *
 **/

var info = {
    revision: 1,
    name: "noname",
    created: "2018-11-28T05:16:59.173Z",
    comment: ""
};

var migrationCommands = [
    {
        fn: "createTable",
        params: [
            "players",
            {
                id: {
                    type: Sequelize.STRING,
                    primaryKey: true
                },
                nickname: {
                    type: Sequelize.STRING
                },
                sleepy: {
                    type: Sequelize.BOOLEAN
                },
                hungry: {
                    type: Sequelize.BOOLEAN
                },
                thirsty: {
                    type: Sequelize.BOOLEAN
                },
                sleepyTime: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                hungryTime: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                thirstyTime: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                balanceCoin: {
                    type: Sequelize.INTEGER
                },
                balanceToken: {
                    type: Sequelize.INTEGER
                },
                level: {
                    type: Sequelize.INTEGER
                },
                userDonateLink: {
                    type: Sequelize.STRING
                },
                XP: {
                    type: Sequelize.STRING
                },
                telegramId: {
                    type: Sequelize.STRING
                },
                data: {
                    type: Sequelize.JSON
                },
                language: {
                    type: Sequelize.STRING
                },
                comics: {
                    type: Sequelize.JSON
                },
                strength: {
                    type: Sequelize.INTEGER
                },
                dexterity: {
                    type: Sequelize.INTEGER
                },
                intelligence: {
                    type: Sequelize.INTEGER
                },
                wisdom: {
                    type: Sequelize.INTEGER
                },
                vitality: {
                    type: Sequelize.INTEGER
                },
                selectedCharacter: {
                    type: Sequelize.JSON
                },
                selectedComics: {
                    type: Sequelize.STRING
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "properties",
            {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                createdAt: {
                    type: Sequelize.DATE
                },
                updatedAt: {
                    type: Sequelize.DATE
                },
                key: {
                    type: Sequelize.STRING
                },
                value: {
                    type: Sequelize.STRING
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "userHistories",
            {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                playerId: {
                    type: Sequelize.STRING
                },
                action: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                data: {
                    type: Sequelize.JSON,
                    allowNull: false
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "sessions",
            {
                id: {
                    type: Sequelize.STRING,
                    primaryKey: true
                },
                session: {
                    type: Sequelize.JSON
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                playerId: {
                    type: Sequelize.STRING,
                    onUpdate: "CASCADE",
                    onDelete: "SET NULL",
                    references: {
                        model: "players",
                        key: "id"
                    },
                    allowNull: true
                }
            },
            {}
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize) {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length) {
                    let command = migrationCommands[index];
                    console.log("[#" + index + "] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                } else resolve();
            }
            next();
        });
    },
    info: info
};
