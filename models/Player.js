module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "player",
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },

            nickname: {
                type: DataTypes.STRING,
            },
            startX: {
                type: DataTypes.INTEGER,
            },
            startY: {
                type: DataTypes.INTEGER,
            },
            balanceCoin: {
                type: DataTypes.INTEGER,
            },
            balanceToken: {
                type: DataTypes.INTEGER,
            },
            level: {
                type: DataTypes.INTEGER,
            },
            infamousLevel: {
                type: DataTypes.INTEGER,
            },
            userDonateLink: {
                type: DataTypes.STRING,
            },
            telegramId: {
                type: DataTypes.STRING,
            },
            data: {
                type: DataTypes.JSON
            },
            server: {
                type: DataTypes.JSON
            },
            attackPrograms: {
                type: DataTypes.JSON
            },
            basement: {
                type: DataTypes.JSON
            },
            coordinates: {
                type: DataTypes.JSON
            },
            personalCoordinates: {
                type: DataTypes.JSON
            },
            currentFloor: {
                type: DataTypes.STRING,
            },
            currentQuest: {
                type: DataTypes.JSON
            },
            language: {
                type: DataTypes.STRING,
            },
            walletsCount: {
                type: DataTypes.INTEGER,
            },
            moduleForBuy: {
                type: DataTypes.JSON
            },
            comics: {
                type: DataTypes.JSON
            },
            hackStatus: {
                type: DataTypes.BOOLEAN
            },
            finalFightWasStarted: {
                type: DataTypes.BOOLEAN
            },
            alreadyStolen: {
                type: DataTypes.BOOLEAN
            },
            selectedCharacter: {
                type: DataTypes.JSON
            },
            selectedComics: {
                type: DataTypes.STRING,
            },
            corporation: {
                type: DataTypes.STRING,
            }
        },
        {
            // timestamps: true,
            //
            // // I don't want createdAt
            // createdAt: true
        }
    );
};
