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
      Cart.hasMany(models.CartDetail);
    }
  };
  Cart.init({
    userId: DataTypes.INTEGER,
    clientFirstName: DataTypes.STRING,
    clientLastName: DataTypes.STRING,
    clientEmail: DataTypes.STRING,
    clientContactInfo: DataTypes.STRING,
    refCode: DataTypes.STRING,
    deliveryOption: DataTypes.STRING,
    deliveryFee: DataTypes.FLOAT,
    subTotal: DataTypes.FLOAT,
    promoCode: DataTypes.STRING,
    promoCodeValue: DataTypes.FLOAT,
    deliveryAddress: DataTypes.STRING,
    billingAddress: DataTypes.STRING,
    paymentStatus: DataTypes.STRING,
    paymentInfo: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};