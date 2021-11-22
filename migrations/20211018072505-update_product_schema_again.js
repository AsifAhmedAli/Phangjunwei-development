module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('Products', 'inWishlist', {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        }, { transaction: t })
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('Products', 'inWishlist', { transaction: t }),
      ])
    })
  }
};