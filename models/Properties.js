module.exports = (sequelize, DataTypes) => {
    return sequelize.define("properties", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // Timestamps
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        key: {
            type: DataTypes.STRING
        },
        value: {
            type: DataTypes.STRING
        }
    });
};
