const Floor = require("./Floor");
module.exports = (sequelize, DataTypes) => {
    let MapItem = sequelize.define(
        "mapItem",
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            x: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            y: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            floor: {
                type: DataTypes.STRING,
                allowNull: false
            },
            data: {
                type: DataTypes.JSON
            }
        },
        {
            timestamps: false,

            // I don't want createdAt
            createdAt: false,

            indexes: [
                // Create a unique index on email
                {
                    unique: true,
                    fields: ["x", "y", "floor"]
                }
            ]
        }
    );
    MapItem.associate = function(models) {
        MapItem.hasMany(models.access, {
            foreignKey: {
                name: "mapItemId",
                allowNull: true
            }
        });
    };
    return MapItem;
};
