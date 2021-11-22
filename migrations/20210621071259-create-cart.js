'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Carts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      clientFirstName: {
        type: Sequelize.STRING
      },
      clientLastName: {
        type: Sequelize.STRING
      },
      clientEmail: {
        type: Sequelize.STRING
      },
      clientContactInfo: {
        type: Sequelize.STRING
      },
      refCode: {
        type: Sequelize.STRING
      },
      deliveryOption: {
        type: Sequelize.STRING
      },
      deliveryFee: {
        type: Sequelize.FLOAT
      },
      subTotal: {
        type: Sequelize.FLOAT
      },
      promoCode: {
        type: Sequelize.STRING
      },
      promoCodeValue: {
        type: Sequelize.FLOAT
      },
      deliveryAddress: {
        type: Sequelize.STRING
      },
      billingAddress: {
        type: Sequelize.STRING
      },
      paymentStatus: {
        type: Sequelize.STRING
      },
      paymentInfo: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Carts');
  }
};