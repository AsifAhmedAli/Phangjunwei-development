'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // create a superadmin
    await queryInterface.bulkInsert('Users', [{
      name: 'Burrows',
      email: 'burrowsadmin@gmail.com',
      password: 'burrows01234',
      role: 'Superadmin',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('User', null, {});
  }
};
