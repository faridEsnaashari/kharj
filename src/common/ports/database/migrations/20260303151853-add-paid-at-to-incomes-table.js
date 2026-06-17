'use strict';

const { DataType } = require('sequelize-typescript');

module.exports = {
  async up(queryInterface) {
    return queryInterface.addColumn('incomes', 'paid_at', {
      type: DataType.DATE,
      allowNull: true,
      field: 'paid_at',
    });
  },
};
