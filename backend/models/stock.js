module.exports = (sequelize, DataTypes) => {
    const Stock = sequelize.define('Stock', {
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
    
    return Stock;
};
