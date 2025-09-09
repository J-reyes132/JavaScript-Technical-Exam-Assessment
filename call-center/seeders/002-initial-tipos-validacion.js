'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tipo_validacion', [
      {
        nombre: 'KYC',
        descripcion: 'Know Your Customer - Validación completa de identidad',
        activo: true
      },
      {
        nombre: 'AML',
        descripcion: 'Anti Money Laundering - Validación contra lavado de activos',
        activo: true
      },
      {
        nombre: 'BASIC',
        descripcion: 'Validación básica de datos personales',
        activo: true
      },
      {
        nombre: 'ENHANCED',
        descripcion: 'Validación mejorada con documentos adicionales',
        activo: true
      },
      {
        nombre: 'QUICK',
        descripcion: 'Validación rápida para servicios express',
        activo: true
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tipo_validacion', null, {});
  }
};
