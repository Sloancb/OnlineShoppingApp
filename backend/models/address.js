module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define('Address', {
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return Address;
};