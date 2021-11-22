module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('Products', 'skuCompany', {
          type: Sequelize.STRING
        }, { transaction: t }),
        queryInterface.addColumn('Products', 'skuTag', {
          type: Sequelize.STRING,
        }, { transaction: t }),
        queryInterface.addColumn('Products', 'skuColor', {
          type: Sequelize.STRING,
        }, { transaction: t })
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('Products', 'skuCompany', { transaction: t }),
        queryInterface.removeColumn('Products', 'skuTag', { transaction: t }),
        queryInterface.removeColumn('Products', 'skuColor', { transaction: t }),
      ])
    })
  }
};