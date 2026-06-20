'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('banks', [
      {
        user_id: null,
        name: 'Nobitex',
        symbol: 'NOBITEX',
        created_at: now,
        updated_at: now,
      },
      {
        user_id: null,
        name: 'Resalat',
        symbol: 'RESALAT',
        created_at: now,
        updated_at: now,
      },
      {
        user_id: null,
        name: 'Bank Melli',
        symbol: 'MELY',
        created_at: now,
        updated_at: now,
      },
      {
        user_id: null,
        name: 'Bank Sepah',
        symbol: 'SEPAH',
        created_at: now,
        updated_at: now,
      },
      {
        user_id: null,
        name: 'Bank Pasargad',
        symbol: 'PASARGAD',
        created_at: now,
        updated_at: now,
      },
      {
        user_id: null,
        name: 'Blue Bank',
        symbol: 'BLUE',
        created_at: now,
        updated_at: now,
      },
      {
        user_id: null,
        name: 'Mofid Securities',
        symbol: 'MOFID',
        created_at: now,
        updated_at: now,
      },
      {
        user_id: null,
        name: 'Bitpin',
        symbol: 'BITPIN',
        created_at: now,
        updated_at: now,
      },
      {
        user_id: null,
        name: 'Digipay',
        symbol: 'DIGIPAY',
        created_at: now,
        updated_at: now,
      },
      {
        user_id: null,
        name: 'General',
        symbol: 'GENERAL',
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('banks', { user_id: null });
  },
};
