module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING
        },
        brand: {
            type: DataTypes.STRING
        },
        size: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.TEXT
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        image_url: {         // 50px x 50px imgs
            type: DataTypes.STRING, 
            defaultValue: 'default.png'
        },
        image_alt: {        // alt image txt
            type: DataTypes.STRING,
            defaultValue: ''
        }
    });

    return Product;
};
