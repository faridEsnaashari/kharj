'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    queryInterface.createTable('user_relations', {
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

      relatedTo: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
          },
          field: 'id',
        },
        field: 'related_to',
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
    queryInterface.dropTable('user_relations');
  },
};
