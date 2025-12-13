'use strict';

const { DataType } = require('sequelize-typescript');

module.exports = {
  async up(queryInterface) {
    return queryInterface.addColumn('payments', 'paid_at', {
      type: DataType.DATE,
      allowNull: true,
      field: 'paid_at',
    });
  },
};
