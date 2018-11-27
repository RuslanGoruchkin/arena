var Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable "donates", deps: []
 * createTable "floors", deps: []
 * createTable "mapItems", deps: []
 * createTable "players", deps: []
 * createTable "accesses", deps: [mapItems]
 * createTable "sessions", deps: [players]
 * addIndex ["x","y","floor"] to table "mapItems"
 *
 **/

var info = {
    revision: 1,
    name: "noname",
    created: "2018-10-25T07:17:40.289Z",
    comment: ""
};

var migrationCommands = [
    {
        fn: "createTable",
        params: [
            "donates",
            {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                user: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                pack: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                quantity: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                invoiceId: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                invoiceExId: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                invoiceDate: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                invoiceMetbhod: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                invoiceAgreement: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                invoiceCurrency: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                invoiceAmount: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "floors",
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
                name: {
                    type: Sequelize.STRING
                },
                floor: {
                    type: Sequelize.STRING
                },
                serverSize: {
                    type: Sequelize.INTEGER
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "mapItems",
            {
                id: {
                    type: Sequelize.STRING,
                    primaryKey: true
                },
                x: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                y: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                floor: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                data: {
                    type: Sequelize.JSON
                }
            },
            {}
        ]
    },
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
                    type: Sequelize.STRING,
                    allowNull: false
                },
                startX: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                startY: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                currentRoom: {
                    type: Sequelize.STRING,
                    allowNull: true
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
                strength: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                dexterity: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                intelligence: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                wisdom: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                vitality: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                balanceCoin: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                balanceToken: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                level: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                infamousLevel: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                userDonateLink: {
                    type: Sequelize.STRING,
                    allowNull: true
                },
                telegramId: {
                    type: Sequelize.STRING,
                    allowNull: true
                },
                inventory: {
                    type: Sequelize.JSON
                },
                fastEquipItem: {
                    type: Sequelize.JSON
                },
                rightHand: {
                    type: Sequelize.JSON
                },
                leftHand: {
                    type: Sequelize.JSON
                },
                armor: {
                    type: Sequelize.JSON
                },
                data: {
                    type: Sequelize.JSON
                },
                server: {
                    type: Sequelize.JSON
                },
                belt: {
                    type: Sequelize.JSON
                },
                basement: {
                    type: Sequelize.JSON
                },
                personalCoordinates: {
                    type: Sequelize.JSON
                },
                currentFloor: {
                    type: Sequelize.STRING,
                    allowNull: true
                },
                currentQuest: {
                    type: Sequelize.JSON
                },
                language: {
                    type: Sequelize.STRING,
                    allowNull: true
                },
                walletsCount: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                moduleForBuy: {
                    type: Sequelize.JSON
                },
                comics: {
                    type: Sequelize.JSON
                },
                hackStatus: {
                    type: Sequelize.BOOLEAN
                },
                finalFightWasStarted: {
                    type: Sequelize.BOOLEAN
                },
                alreadyStolen: {
                    type: Sequelize.BOOLEAN
                },
                selectedCharacter: {
                    type: Sequelize.JSON
                },
                selectedComics: {
                    type: Sequelize.STRING,
                    allowNull: true
                },
                corporation: {
                    type: Sequelize.STRING,
                    allowNull: true
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
            "accesses",
            {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                owner: {
                    type: Sequelize.STRING
                },
                mapItemId: {
                    type: Sequelize.STRING,
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE",
                    references: {
                        model: "mapItems",
                        key: "id"
                    },
                    allowNull: true,
                    name: "mapItemId"
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
    },
    {
        fn: "addIndex",
        params: [
            "mapItems",
            ["x", "y", "floor"],
            {
                indicesType: "UNIQUE"
            }
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
