'use strict';

const { DataType } = require('sequelize-typescript');

module.exports = {
  async up(queryInterface) {
    return queryInterface.addColumn('incomes', 'uncomplete_payment_id', {
      type: DataType.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: {
          tableName: 'uncomplete_payments',
        },
        field: 'id',
      },
      field: 'uncomplete_payment_id',
    });
  },
};
