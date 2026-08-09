'use strict';

const { DataType } = require('sequelize-typescript');

module.exports = {
  async up(queryInterface) {
    await queryInterface.changeColumn('units', 'user_id', {
      type: DataType.BIGINT.UNSIGNED,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.changeColumn('units', 'user_id', {
      type: DataType.BIGINT.UNSIGNED,
      allowNull: false,
    });
  },
};
