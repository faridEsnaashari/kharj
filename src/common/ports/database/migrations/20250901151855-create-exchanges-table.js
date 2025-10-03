'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    queryInterface.createTable('exchanges', {
      id: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
      },
      paymentId: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: {
            tableName: 'payments',
          },
          field: 'id',
        },
        field: 'payment_id',
      },
      incomeId: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: {
            tableName: 'incomes',
          },
          field: 'id',
        },
        field: 'income_id',
      },
      amount: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'amount',
      },
      createdAt: {
        type: DataType.DATE,
        allowNull: true,
        field: 'created_at',
      },

      updatedAt: {
        type: DataType.DATE,
        allowNull: true,
        field: 'updated_at',
      },
    });
  },

  async down(queryInterface) {
    queryInterface.dropTable('exchanges');
  },
};
