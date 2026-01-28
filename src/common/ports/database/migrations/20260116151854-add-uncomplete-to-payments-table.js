'use strict';

const { DataType } = require('sequelize-typescript');

module.exports = {
  async up(queryInterface) {
    return queryInterface.addColumn('payments', 'uncompelete_payment_id', {
      type: DataType.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: {
          tableName: 'uncompelete_payments',
        },
        field: 'id',
      },
      field: 'uncompelete_payment_id',
    });
  },
};
