module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define('Admin', {
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
    });
    return Admin;
};
