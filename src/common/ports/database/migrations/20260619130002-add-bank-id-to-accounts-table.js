'use strict';

const { DataType } = require('sequelize-typescript');

module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn('accounts', 'bank_id', {
      type: DataType.BIGINT.UNSIGNED,
      allowNull: true,
      references: { model: { tableName: 'banks' }, field: 'id' },
      field: 'bank_id',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('accounts', 'bank_id');
  },
};
