'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    queryInterface.addColumn('managers', 'password', {
      type: DataType.STRING(100),
      allowNull: false,
      field: 'password',
    });
  },

  async down() {},
};
