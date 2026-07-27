'use strict';

const { DataType } = require('sequelize-typescript');

module.exports = {
  async up(queryInterface) {
    const columns = [
      ['accounts', 'created_at'],
      ['accounts', 'updated_at'],
      ['payments', 'created_at'],
      ['payments', 'updated_at'],
      ['incomes', 'created_at'],
      ['incomes', 'updated_at'],
      ['account_debts', 'created_at'],
      ['account_debts', 'updated_at'],
      ['exchanges', 'created_at'],
      ['exchanges', 'updated_at'],
      ['users', 'created_at'],
      ['users', 'updated_at'],
      ['user_relations', 'created_at'],
      ['user_relations', 'updated_at'],
    ];

    for (const [table, column] of columns) {
      await queryInterface.changeColumn(table, column, {
        type: DataType.DATE,
        allowNull: true,
        field: column,
      });
    }
  },
};
