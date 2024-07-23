module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        order_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        total_amount: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        delivery_plan_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        payment_method_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return Order;
};
