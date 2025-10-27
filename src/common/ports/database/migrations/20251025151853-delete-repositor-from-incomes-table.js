'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.removeConstraint('incomes', 'incomes_ibfk_2');
    return queryInterface.removeColumn('incomes', 'depositor_id');
  },
};
