/*delivery_plan_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES Orders(order_id),
    delivery_type VARCHAR(50),
    delivery_price DECIMAL,
    delivery_date DATE,
    ship_date DATE*/

module.exports = (sequelize, DataTypes) => {
    const DeliveryPlan = sequelize.define('DeliveryPlan', {
		order_id: {
			type: DataTypes.INTEGER
		},
		delivery_type: {
		  type: DataTypes.STRING
		},
		delivery_price: {
		  type: DataTypes.DECIMAL
		},
        delivery_date: {
            type: DataTypes.DATEONLY
        },
        ship_date: {
            type: DataTypes.DATEONLY
        },
    });

    return DeliveryPlan;
};  