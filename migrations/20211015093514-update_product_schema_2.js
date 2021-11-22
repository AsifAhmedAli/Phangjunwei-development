module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.addColumn('Products', 'skuCategory', {
        type: Sequelize.STRING
      }, { transaction: t })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('Products', 'skuCategory', { transaction: t }),
      ])
    })
  }
};