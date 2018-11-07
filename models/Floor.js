module.exports = (sequelize, DataTypes) => {
    return sequelize.define("floor", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // Timestamps
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        name: {
            type: DataTypes.STRING
        },
        floor: {
            type: DataTypes.STRING
        },
        serverSize: {
            type: DataTypes.INTEGER
        }
    });
};
