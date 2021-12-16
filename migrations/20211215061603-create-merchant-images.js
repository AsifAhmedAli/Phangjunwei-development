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
      MerchantId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Merchants',
          key: 'id'
        }
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
    await queryInterface.dropTable('MerchantImages');
  }
};