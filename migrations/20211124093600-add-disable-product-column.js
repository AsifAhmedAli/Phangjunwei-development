'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('products', 'disabled', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      })
    ]
  },

  down: async (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('products', 'disabled')
    ]
  }
};
