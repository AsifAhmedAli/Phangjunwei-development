'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MerchantImages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      collectionImg: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      bannerImg: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
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
    await queryInterface.dropTable('MerchantImages');
  }
};