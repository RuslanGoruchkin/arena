module.exports = (sequelize, DataTypes) => {
    let Donates = sequelize.define(
        "donates",
        {
            id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true
            },
            user: {
                type: DataTypes.STRING,
                allowNull: false
            },
            pack: {
                type: DataTypes.STRING,
                allowNull: false
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            invoiceId: {
                type: DataTypes.STRING,
                allowNull: false
            },
            invoiceExId: {
                type: DataTypes.STRING,
                allowNull: false
            },
            invoiceDate: {
                type: DataTypes.STRING, //Xsolla date type difference from SQL DATE or DATETIME
                allowNull: false
            },
            invoiceMetbhod: {
                type: DataTypes.STRING,
                allowNull: false
            },
            invoiceAgreement: {
                type: DataTypes.STRING,
                allowNull: false
            },
            invoiceCurrency: {
                type: DataTypes.STRING,
                allowNull: false
            },
            invoiceAmount: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            timestamps: false,
            createdAt: false
        }
    );

    return Donates;
};
