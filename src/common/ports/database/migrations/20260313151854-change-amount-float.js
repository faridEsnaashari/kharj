'use strict';

const { DataType } = require('sequelize-typescript');

module.exports = {
  async up(queryInterface) {
    await queryInterface.changeColumn('accounts', 'ballance', {
      type: DataType.FLOAT,
      allowNull: false,
      field: 'ballance',
    });

    await queryInterface.changeColumn('payments', 'amount', {
      type: DataType.FLOAT,
      allowNull: false,
      field: 'amount',
    });

    await queryInterface.changeColumn('payments', 'remain', {
      type: DataType.FLOAT,
      allowNull: true,
      field: 'remain',
    });

    await queryInterface.changeColumn('incomes', 'remain', {
      type: DataType.FLOAT,
      allowNull: true,
      field: 'remain',
    });

    await queryInterface.changeColumn('incomes', 'amount', {
      type: DataType.FLOAT,
      allowNull: false,
      field: 'amount',
    });

    await queryInterface.changeColumn('exchanges', 'from_amount', {
      type: DataType.FLOAT,
      allowNull: false,
      field: 'from_amount',
    });

    await queryInterface.changeColumn('exchanges', 'to_amount', {
      type: DataType.FLOAT,
      allowNull: false,
      field: 'to_amount',
    });

    await queryInterface.changeColumn('account_debts', 'amount', {
      type: DataType.FLOAT,
      allowNull: false,
      field: 'amount',
    });
  },
};
