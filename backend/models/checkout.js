module.exports = (sequelize, DataTypes) => {
    const Checkout = sequelize.define('Checkout', {
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total_amount: {
            type: DataTypes.DECIMAL,
            allowNull: false
        }
    });

    return Checkout;
};