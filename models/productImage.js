'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductImages extends Model {

        static associate(models) {
            // define association here
            ProductImages.belongsTo(models.Product, { foreignKey: 'productId' });
        }
    };
    ProductImages.init({
        mainImage: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'ProductImages',
    });
    return ProductImages;
};