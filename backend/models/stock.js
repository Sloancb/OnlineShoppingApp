module.exports = (sequelize, DataTypes) => {
    const Stock = sequelize.define('Stock', {
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        warehouse_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
    
    return Stock;
};
