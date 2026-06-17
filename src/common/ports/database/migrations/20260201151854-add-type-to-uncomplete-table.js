'use strict';

const { DataType } = require('sequelize-typescript');

module.exports = {
  async up(queryInterface) {
    return queryInterface.addColumn('uncomplete_payments', 'type', {
      type: DataType.STRING,
      default: 'PAYMENT',
      allowNull: false,
      field: 'type',
    });
  },
};
