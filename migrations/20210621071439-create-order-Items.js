'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OrderItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      OrderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ProductId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      MerchantId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      clientFirstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      clientLastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      clientEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      clientContactInfo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      refCode: {
        type: Sequelize.STRING,
      },
      deliveryOption: {
        type: Sequelize.STRING,
      },
      deliveryFee: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      subTotal: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      promoCode: {
        type: Sequelize.STRING,
      },
      promoCodeValue: {
        type: Sequelize.STRING,
      },
      deliveryAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      billingAddress: {
        type: Sequelize.STRING,
      },
      paymentStatus: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Pending'
      },
      paymentInfo: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('OrderItems');
  }
};