'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Wishlist.belongsTo(models.User);
      Wishlist.belongsTo(models.Product);
    }
  };
  Wishlist.init({
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Wishlist',
  });
  return Wishlist;
};