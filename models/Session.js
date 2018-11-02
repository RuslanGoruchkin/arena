module.exports = (sequelize, DataTypes) => {
    var Session = sequelize.define(
        "session",
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            session: {
                type: DataTypes.JSON
            }
        },
        {
            // timestamps: true,
            //
            // // I don't want createdAt
            // createdAt: true
        }
    );
    Session.associate = function(models) {
        Session.belongsTo(models.player);
    };
    // Player.associate = function(models) {
    //   Player.hasMany(models.access, {
    //     foreignKey: {
    //       name: "mapItemId",
    //       allowNull: true
    //     }
    //   });
    // };
    return Session;
}
