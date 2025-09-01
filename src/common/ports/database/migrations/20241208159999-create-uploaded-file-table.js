'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    queryInterface.createTable('uploaded_files', {
      id: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
      },
      uploadType: {
        type: DataType.STRING(100),
        allowNull: false,
        field: 'upload_type',
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
      path: {
        type: DataType.STRING(10000),
        allowNull: false,
        field: 'path',
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
    queryInterface.dropTable('uploaded_files');
  },
};
