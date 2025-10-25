'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.removeColumn('incomes', 'depositor_id');
  },

  async down(queryInterface) {
    return queryInterface.addColumn('incomes', 'depositor_id', {
      type: DataType.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: {
          tableName: 'users',
        },
        field: 'id',
      },
      field: 'depositor_id',
    });
  },
};
