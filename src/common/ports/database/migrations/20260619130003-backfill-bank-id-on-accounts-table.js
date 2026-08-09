'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      UPDATE accounts
      JOIN banks ON banks.symbol = accounts.bank AND banks.user_id IS NULL
      SET accounts.bank_id = banks.id
      WHERE accounts.bank IS NOT NULL
    `);
  },

  async down() {
    // data backfill, not reversible
  },
};
