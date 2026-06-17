'use strict';

const { DataType } = require('sequelize-typescript');

module.exports = {
  async up(queryInterface) {
    const { sequelize } = queryInterface;
    await sequelize.query(
      'ALTER TABLE `payments` CHANGE `uncompelete_payment_id` `uncomplete_payment_id` BIGINT UNSIGNED NULL DEFAULT NULL; ',
    );

    return sequelize.query(
      ' RENAME TABLE `kharjdb`.`uncompelete_payments` TO `kharjdb`.`uncomplete_payments`; ',
    );
  },
};
