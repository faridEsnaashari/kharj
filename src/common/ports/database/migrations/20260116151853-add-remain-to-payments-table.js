'use strict';

const { DataType } = require('sequelize-typescript');

module.exports = {
  async up(queryInterface) {
    return queryInterface.addColumn('payments', 'remain', {
      type: DataType.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'remain',
    });
  },
};
