'use strict';

const { DataType } = require('sequelize-typescript');

module.exports = {
  async up(queryInterface) {
    await queryInterface.changeColumn('accounts', 'unit_id', {
      type: DataType.BIGINT.UNSIGNED,
      allowNull: false,
    });

    await queryInterface.removeColumn('accounts', 'unit');
  },

  async down(queryInterface) {
    await queryInterface.addColumn('accounts', 'unit', {
      type: DataType.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('accounts', 'unit_id', {
      type: DataType.BIGINT.UNSIGNED,
      allowNull: true,
    });
  },
};
