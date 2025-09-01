'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    queryInterface.createTable('user_has_permissions', {
      id: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
      },
      modelType: {
        type: DataType.STRING(100),
        allowNull: false,
        field: 'model_type',
      },
      modelId: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'model_id',
      },
      permission: {
        type: DataType.STRING(200),
        allowNull: false,
        field: 'permission',
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

  async down() {},
};
