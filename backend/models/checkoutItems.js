module.exports = (sequelize, DataTypes) => {
    const CheckoutItems = sequelize.define('CheckoutItems', {
        checkout_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        product_price: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return CheckoutItems;
};