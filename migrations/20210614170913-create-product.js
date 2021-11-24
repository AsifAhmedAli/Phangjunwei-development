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
      skuId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      skuName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      skuCompany: {
        type: Sequelize.STRING
      },
      skuCategory: {
        type: Sequelize.STRING
      },
      skuTag: {
        type: Sequelize.STRING
      },
      skuColor: {
        type: Sequelize.STRING
      },
      skuStyle: {
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
      },
      inWishlist: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      merchantId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Merchants',
          key: 'id'
        }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Products');
  }
};