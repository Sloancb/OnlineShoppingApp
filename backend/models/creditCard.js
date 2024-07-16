module.exports = (sequelize, DataTypes) => {
    const CreditCard = sequelize.define('CreditCard', {
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true
        },
        card_number: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        expiry_date: {
            type: DataTypes.DATE,
            allowNull: false
        },

        billing_address: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return CreditCard;
};
