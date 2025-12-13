'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.removeConstraint('incomes', 'incomes_ibfk_2');
    return queryInterface.removeColumn('incomes', 'depositor_id');
  },
};
