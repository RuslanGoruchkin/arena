'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "coordinates" to table "players"
 *
 **/

var info = {
    "revision": 2,
    "name": "noname",
    "created": "2018-10-25T07:24:15.699Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "addColumn",
    params: [
        "players",
        "coordinates",
        {
            "type": Sequelize.JSON
        }
    ]
}];

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
