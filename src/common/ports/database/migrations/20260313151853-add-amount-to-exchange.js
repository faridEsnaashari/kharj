'use strict';

const { DataType } = require('sequelize-typescript');

module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn('exchanges', 'to_amount', {
      type: DataType.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'toAmount',
    });

    const { sequelize } = queryInterface;
    await sequelize.query(
      'ALTER TABLE `exchanges` CHANGE `amount` `from_amount` BIGINT UNSIGNED NOT NULL; ',
    );
  },
};
