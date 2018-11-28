module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "userHistory",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            playerId: {
                type: DataTypes.STRING
            },
            action: {
                type: DataTypes.STRING,
                allowNull: false
            },
            data: {
                type: DataTypes.JSON,
                allowNull: false
            }
        },
        {}
    );
};
