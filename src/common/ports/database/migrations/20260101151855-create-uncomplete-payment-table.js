'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    queryInterface.createTable('uncompelete_payments', {
      id: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
      },
      amount: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'amount',
      },
      description: {
        type: DataType.STRING(1000),
        allowNull: false,
        field: 'description',
      },
      paidAt: {
        type: DataType.DATE,
        allowNull: true,
        field: 'paid_at',
      },
      source: {
        type: DataType.STRING,
        allowNull: false,
        field: 'source',
      },
      remain: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'remain',
      },
      accountId: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: {
            tableName: 'accounts',
          },
          field: 'id',
        },
        field: 'account_id',
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
