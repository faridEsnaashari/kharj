'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    queryInterface.createTable('payments', {
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

      isMaman: {
        type: DataType.TINYINT(4),
        default: 0,
        allowNull: false,
        field: 'is_maman',
      },
      isFun: {
        type: DataType.TINYINT(4),
        default: 0,
        allowNull: false,
        field: 'is_fun',
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
    queryInterface.dropTable('payments');
  },
};
