'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Products', // table name
      'orderDetailId', // new field name
      {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Products', 'orderDetailId')
  }
};
