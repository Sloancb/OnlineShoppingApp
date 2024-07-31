module.exports = (sequelize, DataTypes) => {
    const OrderItems = sequelize.define('OrderItems', {
		quantity: {
		  type: DataTypes.INTEGER
		}
    });

    return OrderItems;
};