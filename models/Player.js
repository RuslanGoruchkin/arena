module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "player",
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            nickname: {
                type: DataTypes.STRING
            },
            sleepy: {
                type: DataTypes.BOOLEAN
            },
            hungry: {
                type: DataTypes.BOOLEAN
            },
            thirsty: {
                type: DataTypes.BOOLEAN
            },
            sleepyTime: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            hungryTime: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            thirstyTime: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            balanceCoin: {
                type: DataTypes.INTEGER
            },
            balanceToken: {
                type: DataTypes.INTEGER
            },
            level: {
                type: DataTypes.INTEGER
            },

            userDonateLink: {
                type: DataTypes.STRING
            },
            XP: { type: DataTypes.STRING },
            telegramId: {
                type: DataTypes.STRING
            },
            data: {
                type: DataTypes.JSON
            },

            language: {
                type: DataTypes.STRING
            },

            comics: {
                type: DataTypes.JSON
            },
            strength: {
                type: DataTypes.INTEGER
            },
            dexterity: {
                type: DataTypes.INTEGER
            },
            intelligence: {
                type: DataTypes.INTEGER
            },
            wisdom: {
                type: DataTypes.INTEGER
            },
            vitality: {
                type: DataTypes.INTEGER
            },
            selectedCharacter: {
                type: DataTypes.JSON
            },
            selectedComics: {
                type: DataTypes.STRING
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
