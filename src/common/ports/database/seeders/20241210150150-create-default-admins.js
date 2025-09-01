'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const manager = await queryInterface.insert(null, 'managers', {
      first_name: 'admin1',
      last_name: 'admin1',
      password: '12345678',
      phone: '09140466901',
      national_code: '1273147499',
      birth_of_date: '1378-12-18',
      father_name: 'admin1',
      gender: 'MALE',
      created_at: new Date(),
      updated_at: new Date(),
    });

    const manager2 = await queryInterface.insert(null, 'managers', {
      first_name: 'admin2',
      last_name: 'admin2',
      password: '12345678',
      phone: '09124798930',
      national_code: '0440475120',
      birth_of_date: '1378-12-18',
      father_name: 'admin2',
      gender: 'MALE',
      created_at: new Date(),
      updated_at: new Date(),
    });

    await queryInterface.bulkInsert('user_has_permissions', [
      {
        model_type: 'managers',
        model_id: manager[0],
        permission: 'ALL',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        model_type: 'managers',
        model_id: manager2[0],
        permission: 'ALL',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('managers', null, {});
  },
};
