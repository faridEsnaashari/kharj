'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('units', [
      {
        user_id: null,
        name: 'US Dollar',
        symbol: 'DOLAR',
        created_at: now,
        updated_at: now,
      },
      {
        user_id: null,
        name: 'Rial',
        symbol: 'RIAL',
        created_at: now,
        updated_at: now,
      },
      {
        user_id: null,
        name: 'Euro',
        symbol: 'EUR',
        created_at: now,
        updated_at: now,
      },
      {
        user_id: null,
        name: 'Gold (gram)',
        symbol: 'TALA_GERAM',
        created_at: now,
        updated_at: now,
      },
      {
        user_id: null,
        name: 'Gold (rob)',
        symbol: 'TALA_ROB',
        created_at: now,
        updated_at: now,
      },
      {
        user_id: null,
        name: 'Rent',
        symbol: 'RENT',
        created_at: now,
        updated_at: now,
      },
      {
        user_id: null,
        name: 'Ayar',
        symbol: 'AYAR',
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('units', { user_id: null });
  },
};
