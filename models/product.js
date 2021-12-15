'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Merchant, { foreignKey: 'merchantId' });
      Product.belongsToMany(models.Cart, { through: models.CartItem });
      Product.belongsToMany(models.Order, { through: models.OrderItem });
      Product.hasMany(models.ProductImages, { foreignKey: 'productId' });
    }
  };
  Product.init({
    skuName: DataTypes.STRING,
    skuTag: DataTypes.STRING,
    skuCategory: DataTypes.STRING,
    skuStyle: DataTypes.STRING,
    skuCompany: DataTypes.STRING,
    skuColor: DataTypes.STRING,
    skuPrice: DataTypes.FLOAT,
    type: DataTypes.STRING,
    parentId: DataTypes.INTEGER,
    disabled: DataTypes.BOOLEAN,
    inWishlist: DataTypes.BOOLEAN,
    promoPrice: DataTypes.FLOAT,
    stockQty: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};