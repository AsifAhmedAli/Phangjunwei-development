'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Merchants', 'userId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Merchants', 'userId');
  }
};
