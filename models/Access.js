module.exports = (sequelize, DataTypes) => {
    // Access.associate = function(models) {
    //   Access.belongsTo(models.floor);
    // };
    return sequelize.define(
        "access",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            owner: {
                type: DataTypes.STRING
            },
            mapItemId: {
                type: DataTypes.STRING
            }
        },
        {
            timestamps: false,
            createdAt: false
        }
    );
};
