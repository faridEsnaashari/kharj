'use strict';

const { DataType } = require('sequelize-typescript');

module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn('accounts', 'unit_id', {
      type: DataType.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: { tableName: 'units' },
        field: 'id',
      },
      field: 'unit_id',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('accounts', 'unit_id');
  },
};
