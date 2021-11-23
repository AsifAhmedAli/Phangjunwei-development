'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Merchant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Merchant.hasMany(models.Product);
      // Merchant.belongsTo(models.User, { foreignKey: 'userId' });
    }
  };
  Merchant.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    password: DataTypes.STRING,
    address1: DataTypes.STRING,
    contact1: DataTypes.STRING,
    contact2: DataTypes.STRING,
    email: DataTypes.STRING,
    merchantProductImages: DataTypes.STRING,
    merchantMoodshotImages: DataTypes.STRING,
    merchantAdImages: DataTypes.STRING,
    tier: DataTypes.STRING,
    role: DataTypes.STRING,
    blocked: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Merchant',
  });
  return Merchant;
};