'use strict';

const { DataType } = require('sequelize-typescript');

module.exports = {
  async up(queryInterface) {
    await queryInterface.changeColumn('accounts', 'bank_id', {
      type: DataType.BIGINT.UNSIGNED,
      allowNull: false,
    });

    await queryInterface.removeColumn('accounts', 'bank');
  },

  async down(queryInterface) {
    await queryInterface.addColumn('accounts', 'bank', {
      type: DataType.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('accounts', 'bank_id', {
      type: DataType.BIGINT.UNSIGNED,
      allowNull: true,
    });
  },
};
