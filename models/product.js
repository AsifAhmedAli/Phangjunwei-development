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
      Product.hasMany(models.OrderDetail);
    }
  };
  Product.init({
    skuId: DataTypes.STRING,
    skuName: DataTypes.STRING,
    skuTag: DataTypes.STRING,
    skuCategory: DataTypes.STRING,
    skuStyle: DataTypes.STRING,
    skuCompany: DataTypes.STRING,
    skuColor: DataTypes.STRING,
    skuPrice1: DataTypes.FLOAT,
    skuPrice2: DataTypes.FLOAT,
    skuPrice3: DataTypes.FLOAT,
    skuPrice4: DataTypes.FLOAT,
    srpPrice: DataTypes.FLOAT,
    inWishlist: DataTypes.BOOLEAN,
    promoPrice: DataTypes.FLOAT,
    stockQty: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};