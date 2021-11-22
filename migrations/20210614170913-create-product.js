'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      merchantId: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED
      },
      skuId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      skuName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      skuPrice1: {
        type: Sequelize.FLOAT
      },
      skuPrice2: {
        type: Sequelize.FLOAT
      },
      skuPrice3: {
        type: Sequelize.FLOAT
      },
      skuPrice4: {
        type: Sequelize.FLOAT
      },
      srpPrice: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      promoPrice: {
        type: Sequelize.FLOAT
      },
      stockQty: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Products');
  }
};