module.exports = (sequelize, DataTypes) => {
    const Warehouse = sequelize.define('Warehouse', {
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        control: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return Warehouse;
};
