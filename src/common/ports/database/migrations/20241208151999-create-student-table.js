'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    queryInterface.createTable('students', {
      id: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
      },
      certificateNumber: {
        type: DataType.STRING(100),
        allowNull: false,
        unique: true,
        field: 'certificate_number',
      },
      degreeIssuedDate: {
        type: DataType.STRING(100),
        allowNull: false,
        field: 'degree_issued_date',
      },
      resistanceCityName: {
        type: DataType.STRING(100),
        allowNull: false,
        field: 'resistance_city_name',
      },
      examFieldStudyName: {
        type: DataType.STRING(100),
        allowNull: false,
        field: 'exam_field_study_name',
      },
      quotaType: {
        type: DataType.STRING(100),
        allowNull: false,
        field: 'quota_type',
      },
      interviewUniversityName: {
        type: DataType.STRING(100),
        allowNull: false,
        field: 'interview_university_name',
      },
      certificateIssuedPlaceName: {
        type: DataType.STRING(100),
        allowNull: false,
        field: 'certificate_issued_place_name',
      },
      birthPlaceName: {
        type: DataType.STRING(100),
        allowNull: false,
        field: 'birth_place_name',
      },
      firstName: {
        type: DataType.STRING(100),
        allowNull: false,
        field: 'first_name',
      },
      lastName: {
        type: DataType.STRING(100),
        allowNull: false,
        field: 'last_name',
      },
      phone: {
        type: DataType.STRING(100),
        allowNull: false,
        unique: true,
        field: 'phone',
      },
      password: {
        type: DataType.STRING(100),
        allowNull: false,
        field: 'password',
      },
      nationalCode: {
        type: DataType.STRING(100),
        allowNull: false,
        unique: true,
        field: 'national_code',
      },
      birthOfDate: {
        type: DataType.STRING(100),
        allowNull: false,
        field: 'birth_of_date',
      },
      fatherName: {
        type: DataType.STRING(100),
        allowNull: false,
        field: 'father_name',
      },
      lastUniversityName: {
        type: DataType.STRING(100),
        allowNull: false,
        field: 'last_university_name',
      },
      lastFieldOfStudyCodeName: {
        type: DataType.STRING(100),
        allowNull: false,
        field: 'last_field_of_study_code_name',
      },
      fileNumber: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        unique: true,
        field: 'file_number',
      },
      admissionNumber: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        unique: true,
        field: 'admission_number',
      },
      interviewCode: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'interview_code',
      },
      lastUniversityCode: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'last_university_code',
      },
      lastFieldOfStudyCode: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'last_field_of_study_code',
      },
      gpa: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'gpa',
      },
      resistanceCityCode: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'resistance_city_code',
      },
      examFieldStudyCode: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'exam_field_study_code',
      },
      fieldOfStudyId: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'field_of_study_id',
      },
      totalGrade: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'total_grade',
      },
      status: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'status',
      },
      period: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'period',
      },
      interviewUniversityCode: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'interview_university_code',
      },
      certificateIssuedPlaceCode: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'certificate_issued_place_code',
      },
      birthPlaceCode: {
        type: DataType.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'birth_place_code',
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
    queryInterface.dropTable('students');
  },
};
