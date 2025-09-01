'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    queryInterface.createTable('experts', {
      id: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
      },
      password: {
        type: DataType.STRING(100),
        allowNull: false,
        field: 'password',
      },
      firstName: {
        type: DataType.STRING(100),
        defaultValue: 'admin',
        allowNull: false,
        field: 'first_name',
      },
      lastName: {
        type: DataType.STRING(100),
        defaultValue: 'admin',
        allowNull: false,
        field: 'last_name',
      },
      phone: {
        type: DataType.STRING(11),
        allowNull: true,
        field: 'phone',
      },
      nationalCode: {
        type: DataType.STRING(10),
        allowNull: true,
        field: 'national_code',
      },

      birthOfDate: {
        type: DataType.DATEONLY,
        allowNull: true,
        field: 'birth_of_date',
      },

      fatherName: {
        type: DataType.STRING(100),
        allowNull: true,
        field: 'father_name',
      },

      gender: {
        type: DataType.STRING(6),
        allowNull: false,
        defaultValue: 'MALE',
        field: 'gender',
      },

      createdAt: {
        type: DataType.DATE,
        allowNull: true,
        field: 'created_at',
      },

      updatedAt: {
        type: DataType.DATE,
        allowNull: true,
        field: 'updated_at',
      },
    });
  },

  async down(queryInterface) {
    queryInterface.dropTable('exports');
  },
};
