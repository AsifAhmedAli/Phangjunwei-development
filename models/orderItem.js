'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  OrderItem.init({
    OrderId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER,
    MerchantId: DataTypes.INTEGER,
    clientFirstName: DataTypes.STRING,
    clientLastName: DataTypes.STRING,
    clientEmail: DataTypes.STRING,
    clientContactInfo: DataTypes.STRING,
    refCode: DataTypes.INTEGER,
    deliveryOption: DataTypes.STRING,
    deliveryFee: DataTypes.FLOAT,
    subTotal: DataTypes.FLOAT,
    promoCode: DataTypes.STRING,
    promoCodeValue: DataTypes.FLOAT,
    deliveryAddress: DataTypes.STRING,
    billingAddress: DataTypes.STRING,
    paymentStatus: DataTypes.STRING,
    paymentInfo: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'OrderItem',
  });
  return OrderItem;
};