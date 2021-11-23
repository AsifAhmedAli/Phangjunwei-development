'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsTo(models.User, { foreignKey: 'userId' });
      Cart.hasOne(models.CartItem);
      Cart.belongsToMany(models.Product, { through: models.CartItem });
    }
  };
  Cart.init({}, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};