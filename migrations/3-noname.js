'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "corporation" on table "players"
 * changeColumn "selectedComics" on table "players"
 * changeColumn "walletsCount" on table "players"
 * changeColumn "language" on table "players"
 * changeColumn "currentFloor" on table "players"
 * changeColumn "telegramId" on table "players"
 * changeColumn "startX" on table "players"
 * changeColumn "infamousLevel" on table "players"
 * changeColumn "level" on table "players"
 * changeColumn "balanceToken" on table "players"
 * changeColumn "balanceCoin" on table "players"
 * changeColumn "startY" on table "players"
 * changeColumn "nickname" on table "players"
 * changeColumn "userDonateLink" on table "players"
 *
 **/

var info = {
    "revision": 3,
    "name": "noname",
    "created": "2018-10-31T09:54:27.472Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "changeColumn",
        params: [
            "players",
            "corporation",
            {
                "type": Sequelize.STRING
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "players",
            "selectedComics",
            {
                "type": Sequelize.STRING
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "players",
            "walletsCount",
            {
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "players",
            "language",
            {
                "type": Sequelize.STRING
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "players",
            "currentFloor",
            {
                "type": Sequelize.STRING
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "players",
            "telegramId",
            {
                "type": Sequelize.STRING
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "players",
            "startX",
            {
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "players",
            "infamousLevel",
            {
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "players",
            "level",
            {
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "players",
            "balanceToken",
            {
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "players",
            "balanceCoin",
            {
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "players",
            "startY",
            {
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "players",
            "nickname",
            {
                "type": Sequelize.STRING
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "players",
            "userDonateLink",
            {
                "type": Sequelize.STRING
            }
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
