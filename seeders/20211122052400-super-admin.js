'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // create a superadmin
    await queryInterface.bulkInsert('Users', [{
      name: 'qasim',
      email: 'qasim@gmail.com',
      password: 'something',
      role: 'Superadmin',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('User', null, {});
  }
};
