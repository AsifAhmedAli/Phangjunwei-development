module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('Merchants', 'merchantProductImages', {
          type: Sequelize.STRING
        }, { transaction: t }),
        queryInterface.addColumn('Merchants', 'merchantMoodshotImages', {
          type: Sequelize.STRING
        }, { transaction: t }),
        queryInterface.addColumn('Merchants', 'merchantAdImages', {
          type: Sequelize.STRING
        }, { transaction: t })
      ]);
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('Merchants', 'merchantProductImages', { transaction: t }),
        queryInterface.removeColumn('Merchants', 'merchantProductImages', { transaction: t }),
        queryInterface.removeColumn('Merchants', 'merchantProductImages', { transaction: t }),
      ])
    })
  }
};