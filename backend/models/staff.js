module.exports = (sequelize, DataTypes) => {
    const Staff = sequelize.define('Staff', {
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
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        salary: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        job_title: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    return Staff;
};