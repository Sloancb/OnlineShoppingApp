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
        credit_card_name: {
            type: DataTypes.STRING
        },
        credit_card_number: {
            type: DataTypes.STRING
        },
        credit_card_date_expire: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
        },
    });

    return Customer;
};
