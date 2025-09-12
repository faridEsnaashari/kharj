'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    queryInterface.createTable('users', {
      id: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
      },
      name: {
        type: DataType.STRING(100),
        allowNull: false,
        field: 'name',
      },
      relatedCode: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'related_code',
      },
      relatedCode: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        unique: true,
        field: 'related_code',
      },
      password: {
        type: DataType.STRING(1000),
        allowNull: false,
        field: 'password',
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
    queryInterface.dropTable('users');
  },
};
