'use strict';

module.exports = {
  async up(queryInterface) {
    const [accounts] = await queryInterface.sequelize.query(
      'SELECT id, user_id, unit FROM accounts WHERE unit IS NOT NULL',
    );

    for (const acc of accounts) {
      const [existing] = await queryInterface.sequelize.query(
        'SELECT id FROM units WHERE user_id = :userId AND symbol = :symbol LIMIT 1',
        { replacements: { userId: acc.user_id, symbol: acc.unit } },
      );

      let unitId;

      if (existing.length > 0) {
        unitId = existing[0].id;
      } else {
        const [insertId] = await queryInterface.sequelize.query(
          'INSERT INTO units (user_id, name, symbol, created_at, updated_at) VALUES (:userId, :name, :symbol, NOW(), NOW())',
          {
            replacements: {
              userId: acc.user_id,
              name: acc.unit,
              symbol: acc.unit,
            },
          },
        );
        unitId = insertId;
      }

      await queryInterface.sequelize.query(
        'UPDATE accounts SET unit_id = :unitId WHERE id = :id',
        { replacements: { unitId, id: acc.id } },
      );
    }
  },

  async down() {
    // data backfill, not reversible
  },
};
