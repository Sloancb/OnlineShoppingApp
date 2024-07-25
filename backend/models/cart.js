module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
		customer_id: {
			type: DataTypes.INTEGER
		},
		product_id: {
		  type: DataTypes.INTEGER
		},
		quantity: {
		  type: DataTypes.INTEGER
		}
    });

    return Cart;
};