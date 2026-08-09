'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    queryInterface.createTable('banks', {
      id: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
      },
      userId: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: true,
        references: { model: { tableName: 'users' }, field: 'id' },
        field: 'user_id',
      },
      name: {
        type: DataType.STRING(100),
        allowNull: false,
        field: 'name',
      },
      symbol: {
        type: DataType.STRING(20),
        allowNull: false,
        field: 'symbol',
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
    queryInterface.dropTable('banks');
  },
};
