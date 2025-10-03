'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    queryInterface.createTable('accounts', {
      id: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
      },
      userId: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
          },
          field: 'id',
        },
        field: 'user_id',
      },

      ownedBy: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
          },
          field: 'id',
        },
        field: 'owned_by',
      },
      ballance: {
        type: DataType.BIGINT.UNSIGNED,
        default: 0,
        allowNull: false,
        field: 'ballance',
      },
      bank: {
        type: DataType.STRING(100),
        allowNull: false,
        field: 'bank',
      },
      priority: {
        type: DataType.TINYINT(100),
        default: 0,
        allowNull: false,
        field: 'priority',
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
    queryInterface.dropTable('accounts');
  },
};
