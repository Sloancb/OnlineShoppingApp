module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define('Customer', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        current_balance: {
            type: DataTypes.DECIMAL,
            defaultValue: 0
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        
        }
    });

    return Customer;
};
