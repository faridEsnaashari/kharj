'use strict';

const { DataType } = require('sequelize-typescript');

module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn('accounts', 'unit', {
      type: DataType.STRING,
      allowNull: false,
      default: 'RIAL',
      field: 'unit',
    });
  },
};
