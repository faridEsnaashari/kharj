'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.insert(null, 'users', {
      name: 'admin',
      password: '12345678',
      related_code: 111111,
      created_at: new Date(),
      updated_at: new Date(),
    });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
