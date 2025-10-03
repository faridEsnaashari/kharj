'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    queryInterface.createTable('incomes', {
      id: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
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

      depositorId: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
          },
          field: 'id',
        },
        field: 'depositor_id',
      },

      amount: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'amount',
      },

      category: {
        type: DataType.STRING(200),
        allowNull: false,
        field: 'category',
      },
      description: {
        type: DataType.STRING(500),
        allowNull: true,
        field: 'description',
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
    queryInterface.dropTable('incomes');
  },
};
