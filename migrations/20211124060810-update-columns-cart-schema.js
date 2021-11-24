'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('carts', 'createdAt', {
        type: Sequelize.DATE,
        allowNull: false,
      }),
      queryInterface.addColumn('carts', 'updatedAt', {
        type: Sequelize.DATE,
        allowNull: false,
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return promise.all([
      queryInterface.removeColumn('carts', 'createdAt'),
      queryInterface.removeColumn('carts', 'updatedAt')
    ])
  }
};
