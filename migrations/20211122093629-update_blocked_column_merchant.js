module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('Merchants', 'blocked', {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        }, { transaction: t })
      ]);
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('Merchants', 'blocked', { transaction: t }),
      ])
    })
  }
};